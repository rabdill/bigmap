players = {
    'Rebels' : {
        'airplanes' : false
    },
    'Govt' : {
        'airplanes' : false
    }
}
regions = {
    'nj' : {
        'full_name' : 'New Jersey',
        'attackable' : [
            "pa",
            "ny",
            "de"
        ],
        "control" : "Rebels",
        "starting_strength" : 5,
		"latlong" : [
            [39.12, -74.83],
            [40.33, -73.96],
            [40.49, -74.28],
            [40.98, -73.94],
            [41.36, -74.7],
            [40.45, -75.07],
            [40.19, -74.71],
            [39.62, -75.56],
            [39.47, -75.52]
        ],
        "labels" : {
			"abbrev" : [40.26, -74.59],
            "strength" : [39.72, -75.00]
		}
	},
    'pa' : {
        'full_name' : 'Pennsylvania',
        'attackable' : [
            "nj",
            "ny",
            "de",
            "md",
            "wv",
            "oh"
        ],
        "control" : "Govt",
        "starting_strength" : 5,
		"latlong" : [
            [41.36, -74.7],
            [40.45, -75.07],
            [40.19, -74.71],
            [39.62, -75.56],
            [39.72, -75.52],
            [39.72, -80.49],
            [41.98, -80.49],
            [42.39, -79.79],
            [41.98, -79.79],
            [41.98, -75.34]
        ],
        "labels" : {
			"abbrev" : [40.87, -78.62],
            "strength" : [40.26, -77.06]
		}
	},
    'ny' : {
        'full_name' : 'New York',
        'attackable' : [
            "pa",
            "nj"
        ],
        "control" : "Rebels",
        "starting_strength" : 5,
		"latlong" : [
            [42.39, -79.79],
            [41.98, -79.79],
            [41.98, -75.34],
            [41.36, -74.7],
            [40.98, -73.94],
            [42.04, -73.49],
            [42.74, -73.26],
            [45.00, -73.46],
            [45.00, -74.85],
            [43.63, -76.78],
            [43.44, -79.20],
            [42.81, -78.93]
        ],
        "labels" : {
			"abbrev" : [42.93, -76.55],
            "strength" : [42.18, -74.90]
		}
	},
    'de' : {
        'full_name' : 'Delaware',
        'attackable' : [
            "pa",
            "md",
            "nj"
        ],
        "control" : "Rebels",
        "starting_strength" : 5,
		"latlong" : [
            [39.62, -75.56],
            [39.15, -75.39],
            [38.76, -75.03],
            [38.42, -75.05], // start of MD border
            [38.42, -75.66],
            [39.69, -75.66], // end
            [39.72, -75.52]
        ],
        "labels" : {
			"abbrev" : [38.90, -75.45],
            "strength" : [38.45, -75.44]
		}
	},
    'md' : {
        'full_name' : 'Maryland',
        'attackable' : [
            "pa",
            "va",
            "de",
            "wv"
        ],
        "control" : "Govt",
        "starting_strength" : 5,
		"latlong" : [
            [38.42, -75.05],
            [37.31, -75.94],
            [38.47, -76.28],
            [39.24, -76.24],
            [39.51, -75.94],
            [39.20, -76.51], // baltimore
            [38.37, -76.39],
            [38.08, -76.33],
            [38.49, -77.22],
            [38.87, -77.01], //dc
            [39.14, -77.52],
            [39.32, -77.71],
            [39.57, -78.79],
            [39.23, -79.48],
            [39.72, -79.48], // NW intersection w PA
            [39.72, -75.66],
            [38.42, -75.66]
        ],
        "labels" : {
			"abbrev" : [39.17, -77.2],
            "strength" : [38.67, -76.91]
		}
	},
    'va' : {
        'full_name' : 'Virginia',
        'attackable' : [
            "md",
            "wv"
        ],
        "control" : "Govt",
        "starting_strength" : 5,
		"latlong" : [
            [38.87, -77.01], //dc
            [39.14, -77.52],
            [39.32, -77.71], // start of WV border
            [39.13, -77.83],
            [38.77, -78.88],
            [38.85, -79.00],
            [38.42, -79.32],
            [38.60, -79.66],
            [37.31, -81.02],
            [37.21, -81.66],
            [37.52, -82.00], // end of WV border
            [36.56, -83.68], // end of KY border
            [36.56, -75.97], // end of NC border
            [37.92, -76.27],
            [38.35, -77.30]
        ],
        "labels" : {
			"abbrev" : [37.99, -78.68],
            "strength" : [37.23, -78.53]
		}
	},
    'wv' : {
        'full_name' : 'West Virginia',
        'attackable' : [
            "pa",
            "md",
            "va",
            "oh"
        ],
        "control" : "Rebels",
        "starting_strength" : 5,
		"latlong" : [
            [39.32, -77.71], // start of WV border
            [39.13, -77.83],
            [38.77, -78.88],
            [38.85, -79.00],
            [38.42, -79.32],
            [38.60, -79.66],
            [37.31, -81.02],
            [37.21, -81.66],
            [37.52, -82.00], // start of KY border
            [38.44, -82.55], // end of ky border, start of OH
            [39.02, -82.01],
            [38.89, -81.90],
            [39.71, -80.83],
            [40.17, -80.69],
            [40.50, -80.62],
            [40.60, -80.66],
            [40.64, -80.49], // end of OH border
            [39.72, -80.49],
            [39.72, -79.48], // start of MD border
            [39.23, -79.48],
            [39.57, -78.79]
        ],
        "labels" : {
			"abbrev" : [38.51, -81.47],
            "strength" : [38.80, -80.13]
		}
	},
    'oh' : {
        'full_name' : 'Ohio',
        'attackable' : [
            "pa",
            "wv"
        ],
        "control" : "Govt",
        "starting_strength" : 5,
		"latlong" : [
            [38.44, -82.55], // end of ky border, start of OH
            [39.02, -82.01],
            [38.89, -81.90],
            [39.71, -80.83],
            [40.17, -80.69],
            [40.50, -80.62],
            [40.60, -80.66],
            [40.64, -80.49],
            [41.98, -80.49], // north border of PA
            [41.43, -81.78],
            [41.46, -82.96],
            [41.69, -83.45], // east end of MI border
            [41.68, -84.79], // west side of MI border
            [39.24, -84.81], // south end of IN border
            [38.69, -83.58]
        ],
        "labels" : {
			"abbrev" : [40.18, -83.60],
            "strength" : [40.18, -82.00]
        }
    }
};
