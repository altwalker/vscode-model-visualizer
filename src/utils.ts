
const rankdirMap = {
    "Top-Bottom": "TB",
    "Bottom-Top": "BT",
    "Left-Right": "LR",
    "Right-Left": "RL",
};

const alignMap = {
    "Up-Left": "UL",
    "Up-Right": "UR",
    "Down-Left": "DL",
    "Down-Right": "DR"
};

const rankerMap = {
    "Longest Path": "longest-path",
    "Tight Tree": "tight-tree",
    "Network Simplex": "network-simplex"
};

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj;
}

export function getRankdir(rankdir: any) {
    if (hasKey(rankdirMap, rankdir)) {
        return rankdirMap[rankdir];
    }
    return rankdirMap["Top-Bottom"];
}

export function getAlign(align: any) {
    if (hasKey(alignMap, align)) {
        return alignMap[align];
    }
    return alignMap["Up-Left"];
}

export function getRanker(ranker: any) {
    if (hasKey(rankerMap, ranker)) {
        return rankerMap[ranker];
    }
    return rankerMap["Network Simplex"];
}