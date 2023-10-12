
from config import CONFIG, METADATA
from PIL import Image, ImageDraw, ImageFont
import pandas as pd
import numpy as np
import time
import os
import math
import random
from pandas.core.frame import DataFrame
import sys


import warnings

warnings.simplefilter(action="ignore", category=FutureWarning)

def parse_config():

    assets_path = "assets"

    for layer in CONFIG:

        layer_path = os.path.join(assets_path, layer["directory"])

        traits = sorted(
            [trait for trait in os.listdir(layer_path) if trait[0] != "."])

        if not layer["required"]:
            traits = [None] + traits

        if layer["rarity_weights"] is None:
            rarities = [1 for x in traits]
        elif layer["rarity_weights"] == "random":
            rarities = [random.random() for x in traits]
        elif type(layer["rarity_weights"] == "list"):
            assert len(traits) == len(
                layer["rarity_weights"]
            ), "Make sure you have the current number of rarity weights"
            rarities = layer["rarity_weights"]
        else:
            raise ValueError("Rarity weights is invalid")

        rarities = get_weighted_rarities(rarities)

        layer["rarity_weights"] = rarities
        layer["cum_rarity_weights"] = np.cumsum(rarities)
        layer["traits"] = traits

def get_weighted_rarities(arr):
    return np.array(arr) / sum(arr)

def generate_single_image(filepaths, number, output_filename=None):

    bg = Image.open(os.path.join("assets", filepaths[0])).convert('RGBA')

    for filepath in filepaths[1:]:           
        if filepath.endswith(".png"):                
            img_clear = Image.new("RGBA", bg.size, (255, 255, 255, 0))
            img = Image.open(os.path.join("assets", filepath)).convert('RGBA')
            #レイヤーがtemplateの場合、左上をトリミングする。
            if(filepath[1] == "2"):
                img = img.crop((0, 0, 500, 500)) 
            img_clear.paste(img, (0, 0))
            bg = Image.alpha_composite(bg, img_clear)
    
    if output_filename is not None:
        bg.save(output_filename)
    else:

        if not os.path.exists(os.path.join("images", "single_images")):
            os.makedirs(os.path.join("images", "single_images"))
        bg.save(os.path.join("images", "single_images",
                str(int(time.time())) + ".png"))
    
    """シリアルナンバー入力"""
    newImg = Image.open("images/"+number+".png")
    draw = ImageDraw.Draw(newImg)
    font = ImageFont.truetype("/Users/ggg/dev/generative_nft/packages/backend/font/Inter-VariableFont_slnt,wght.ttf", 30)
    #templateが黒色の場合、黒文字
    if (filepaths[1][12:17] == '02_01'):
        draw.text((1350, 20), 'CREW CARD', font=font, fill='#000000')
        draw.text((1350, 55), '#'+number, font=font, fill='#000000')
    #templateが白色の場合、白文字
    if (filepaths[1][12:17] == '02_02'):
        draw.text((1350, 20), 'CREW CARD', font=font, fill='#FFFFFF')
        draw.text((1350, 55), '#'+number, font=font, fill='#FFFFFF')
    
    newImg.save("images/"+number+".png")

def get_total_combinations() -> int:

    total = 1
    for layer in CONFIG:
        total = total * len(layer["traits"])
    return total


def select_index(cum_rarities, rand):

    cum_rarities = [0] + list(cum_rarities)
    for i in range(len(cum_rarities) - 1):
        if rand >= cum_rarities[i] and rand <= cum_rarities[i + 1]:
            return i

    return None


def get_link_value(linklist, trait_set):
    for link in linklist.keys():
        if link in trait_set:
            return linklist[link]
    raise Exception("linklist don't find in trait_set")


def generate_trait_set_from_config():

    trait_set = []
    trait_paths = []

    for layer in CONFIG:

        traits, cum_rarities = layer["traits"], layer["cum_rarity_weights"]

        rand_num = random.random()
 
        idx = select_index(cum_rarities, rand_num)
        try:
            if layer["link"]:
                trait_value = get_link_value(layer["link"], trait_set)
                trait_set.append(trait_value)
                trait_path = os.path.join(layer["directory"], trait_value)
                trait_paths.append(trait_path)
        except KeyError:
      
            trait_set.append(traits[idx])

            if traits[idx] is not None:
                trait_path = os.path.join(layer["directory"], traits[idx])
                trait_paths.append(trait_path)
    return trait_set, trait_paths

"""

@param {generated_count} - 現在までに生成された画像数
"""
def generate_images(count: int) -> DataFrame:
    """Generate Images from rarity table"""

    rarity_table = {}
    for layer in CONFIG:
        rarity_table[layer["name"]] = []

    op_path = os.path.join("images")

    if not os.path.exists(op_path):
        os.makedirs(op_path)
    generate_traits_sets=[]
    #生成済み組み合わせの読み込み
    if os.path.isfile('./generated_layer/generated_layer.csv'):
        generated_layers_DataFrame = pd.read_csv(
            './generated_layer/generated_layer.csv')
        generated_layers=generated_layers_DataFrame.values.tolist()
        for generated_layer in generated_layers:
            generate_traits_sets.append(generated_layer)
    #禁止組み合わせの読み込み
    if os.path.isfile('./prohibited_comb/prohibited_comb.csv'):
        prohibited_comb_DataFrame = pd.read_csv(
            './prohibited_comb/prohibited_comb.csv')
        prohibited_comb = prohibited_comb_DataFrame.values.tolist()
    try_count=0
    n=0
    generated_count=len(generate_traits_sets)
    
    while n<count:
        if try_count>5000:
            print("error")
            sys.exit()
        image_name = str(n+generated_count).zfill(6)+ ".png"

        trait_sets, trait_paths = generate_trait_set_from_config()
        for_checking_trait_sets=trait_sets
        for idx,trait_set in  enumerate(for_checking_trait_sets):
            for_checking_trait_sets[idx]=trait_set[: -1 * len(".png")]
        
        """すでに生成されているレイヤーの組み合わせでないか確認""" 
        before_generate_traits_sets_len = len(generate_traits_sets)
        generate_traits_sets.append(for_checking_trait_sets)
        generate_traits_sets = list(map(list, set(map(tuple, generate_traits_sets))))
        
        """禁止された組み合わせでないか確認"""
        prohibited_flag = False
        for prohibited_layers in prohibited_comb:
            #禁止組み合わせの要素数を取得
            prohibited_layer_count = 0 
            for prohibited_layer in prohibited_layers:
                if not math.isnan(float(prohibited_layer)):
                    prohibited_layer_count += 1
            #禁止組み合わせの要素と一致している数を取得
            equal_prohibited_count = 0
            for for_checking_trait_set in for_checking_trait_sets:
                for prohibited_layer in prohibited_layers:
                    if for_checking_trait_set == prohibited_layer:
                        equal_prohibited_count += 1
            if prohibited_layer_count == equal_prohibited_count:
                prohibited_flag = True

        #すでに生成されている組み合わせ or 禁止された組み合わせの場合,continue 
        if (len(generate_traits_sets) == before_generate_traits_sets_len) or prohibited_flag:
            try_count+=1
            continue
        for idx, trait in enumerate(trait_sets):
            if trait is not None:
                rarity_table[CONFIG[idx]["name"]].append(
                    trait)
            else:
                rarity_table[CONFIG[idx]["name"]].append("none")

        generate_single_image(trait_paths, str(n+generated_count).zfill(6), os.path.join(op_path, image_name))
        n+=1
    rarity_table = pd.DataFrame(rarity_table)
    
    if os.path.isfile('./generated_layer/generated_layer.csv'):
        new_generated_layers_DataFrame=pd.concat([generated_layers_DataFrame,rarity_table])
        new_generated_layers_DataFrame.to_csv(
            os.path.join("generated_layer","generated_layer.csv"),
            index=False)
    else :
        rarity_table.to_csv(
            os.path.join("generated_layer","generated_layer.csv"),
            index=False)
    return rarity_table


def generate_metadata(rarity_table: DataFrame):
    """Generate Metadata CSV from rarity data csv."""

    meta_list = []
    meta_index = []

    meta_column = list(METADATA.keys())
    rarity_column = rarity_table.keys().tolist()
    meta_column.extend(rarity_column)
    all_meta_list=[]

    for index, row in rarity_table.iterrows():
        meta_index.append(str(index))
        listvalue = []
        for metavalue in METADATA.values():
            listvalue.append(metavalue.replace("_ID_", str(index)))
        listvalue.extend(row.to_list())
        
        meta_list.append(listvalue)
        meta_list[0][2]+=str(index)+".png"
        
        meta_dataframe = pd.DataFrame(
            data=meta_list, index=meta_index, columns=meta_column)
        meta_dataframe.to_csv(
            os.path.join("output_csv",str(index)+".csv"),
            index=False)
        meta_dataframe.to_json(
            os.path.join("output_json",str(index)+".json"),
            orient="records",
            lines=True
            )
        all_meta_list.append(meta_list)
        meta_list=[]
        meta_index=[]
   
    meta_dataframe.to_csv(
            os.path.join("output_csv",str(index)+".csv"),
            index=False)


def main():
    data = sys.stdin.readline()  
    count=int(data)
    parse_config()
    rt = generate_images(count)
    generate_metadata(rt)

    return "generate complete!"

main()
