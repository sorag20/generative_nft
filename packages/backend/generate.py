
from config import CONFIG, METADATA
from PIL import Image
import pandas as pd
import numpy as np
import time
import os
import random
from pandas.core.frame import DataFrame
from progressbar import progressbar
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

def generate_single_image(filepaths, output_filename=None):

    bg = Image.open(os.path.join("assets", filepaths[0])).convert('RGBA')

    for filepath in filepaths[1:]:
        if filepath.endswith(".png"):
            img_clear = Image.new("RGBA", bg.size, (255, 255, 255, 0))
            img = Image.open(os.path.join("assets", filepath)).convert('RGBA')
            img_clear.paste(img, (0, 0))
            bg = Image.alpha_composite(bg, img_clear)

    if output_filename is not None:
        bg.save(output_filename)
    else:

        if not os.path.exists(os.path.join("images", "single_images")):
            os.makedirs(os.path.join("images", "single_images"))
        bg.save(os.path.join("images", "single_images",
                str(int(time.time())) + ".png"))

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

def generate_images(count: int) -> DataFrame:
    """Generate Images from rarity table"""

    rarity_table = {}
    for layer in CONFIG:
        rarity_table[layer["name"]] = []

    op_path = os.path.join("images")

    if not os.path.exists(op_path):
        os.makedirs(op_path)


    generate_traits_sets=[]
    n=0
    while n<count:
        
        image_name = str(n)+ ".png"

        trait_sets, trait_paths = generate_trait_set_from_config()
        generate_traits_sets.append(trait_sets)
        generate_traits_sets = list(map(list, set(map(tuple, generate_traits_sets))))
        
        if len(generate_traits_sets)==n:
            continue
        
        for idx, trait in enumerate(trait_sets):
            if trait is not None:
                rarity_table[CONFIG[idx]["name"]].append(
                    trait[: -1 * len(".png")])
            else:
                rarity_table[CONFIG[idx]["name"]].append("none")

        
        generate_single_image(trait_paths, os.path.join(op_path, image_name))
        n+=1
    rarity_table = pd.DataFrame(rarity_table)
    return rarity_table


def generate_metadata(rarity_table: DataFrame):
    """Generate Metadata CSV from rarity data csv."""

    meta_list = []
    meta_index = []

    meta_column = list(METADATA.keys())
    rarity_column = rarity_table.keys().tolist()
    meta_column.extend(rarity_column)

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
        print(meta_dataframe)
        meta_dataframe.to_json(
            os.path.join("output_json",str(index)+".json"),
            orient="records",
            lines=True
            )
        meta_list=[]
        meta_index=[]


def main():
    data = sys.stdin.readline()  
    count=int(data)
    parse_config()
    rt = generate_images(count)
    generate_metadata(rt)

    return "generate complete!"

main()
