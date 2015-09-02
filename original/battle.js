player = 'Rebels';
displaying = 'total' // what number we're showing in the region labels
mapDrawn = false;
canvasWidth = document.getElementById('canvas').width;  // not local variable; used by convertLatlong();
minX = -84.8;   // top-left corner X value, in longitude
maxX = -73;
width = 12;     // width of the country in degrees longitude
maxY = 45;      // top-left corner Y value, in latitude
counter = 0;    // tracking the unit ID that was last assigned

function flipDisplay() {
    var newHed;
    var newSub;
    if(displaying == 'total') {
        displaying = 'available';
        newSub = 'Showing available units';
    } else {
        displaying = 'total';
        newSub = 'Showing total units';
    }
    document.getElementById('displayDescribe').innerHTML = newSub;
    relabel();
}

function printer(message,element) {
    if(element == 'alarm') {
        window.alert(message);
        element = 'status';
    }
    document.getElementById(element).innerHTML = message;
    if(element == 'status' && message != '') {
        console.log(player + ': ' + message);
    }
}

function regionsearch(data, filter) {
    var results = {};
    for(var region in data) {
        if(filter(data[region])) {
            results[region] = data[region];
        }
    }
    return results;
}

function convertLatlong(coords) {
    var results = [];
    results[0] = (coords[1] - minX) + (coords[1] - minX)*(canvasWidth/width);
    results[1] = (maxY - coords[0])*(canvasWidth/width);
    return results;
}

function draw() {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); // not local variable; used by relabel()

    for(var region in regions) {
        // translate the lat/long into coordinates on the canvas
        regions[region]['draw'] = [];
        for (var i=0, coord; coord = regions[region]['latlong'][i]; i++) {
            regions[region]['draw'][i] = convertLatlong(coord);
        }

        regions[region]['shape'] = new Path2D();
        regions[region]['shape'].moveTo(regions[region]['draw'][0][0],regions[region]['draw'][0][1]);

        for (var i=1; i < regions[region]['draw'].length; i++) {
            regions[region]['shape'].lineTo(regions[region]['draw'][i][0], regions[region]['draw'][i][1]);
        }
        // close the shape:
        regions[region]['shape'].lineTo(regions[region]['draw'][0][0], regions[region]['draw'][0][1]);

        // fill the region with units
        regions[region]['units'] = [];
		add_units(regions[region].starting_strength,region);

        relabel(region);
    }
    mapDrawn = true; // to keep track of whether the regions are all
                    // accounted for
    printActions('all');
    distributeUnits(3);
}

function relabel(region) {
    if(!region) {   // relabel all if not specified
        for(var r in regions) {
            relabel(r);
        }
    } else {
        // color it in:
        if(regions[region].control == 'Rebels') {
            ctx.fillStyle = 'orange';
        } else {
            ctx.fillStyle = 'blue';
        }
        ctx.fill(regions[region]['shape']);   // color
        ctx.stroke(regions[region]['shape']); // outline

        // add the labels:
        if('labels' in regions[region]) {
            var labelXY;
            var displayNum;
            if('abbrev' in regions[region].labels) {
                ctx.font = '30px sans-serif';
                labelXY = convertLatlong(regions[region].labels.abbrev);
                ctx.fillStyle = 'black';
                ctx.fillText(region, labelXY[0], labelXY[1]);
            }
            if(displaying == 'total') {
                displayNum = regions[region].units.length;
            } else if(displaying == 'available') {
                displayNum = 0;
                for(var i=0, unit; unit = regions[region].units[i]; i++) {
                    if(unit.available) {
                        displayNum++;
                    }
                }
                if(displayNum == regions[region].units.length) {
                    displayNum--;   // we need to leave at least one behind
                }
            } else {
                console.log('ERROR: "displaying" is set to neither "total" nor "available"');
            }
            ctx.font = '25px sans-serif';
            labelXY = convertLatlong(regions[region].labels.strength);
            ctx.fillStyle = 'black';
            ctx.fillText(displayNum, labelXY[0], labelXY[1]);
        }
        if(mapDrawn) {
            printActions('all'); // to re-evaluate if any should be removed
        }
        checkForWin();
    }
}

actions = {
    'attack' : {
        'onclick' : 'attackTarget();',
        'text' : 'Stage an attack',
        'id' : 'attackLink',
        'test' : function() {
            return Object.keys(findTargets('attack')).length > 0
        }
    },
    'reinforce' : {
        'onclick' : 'reinforceTarget();',
        'text' : 'Send reinforcements',
        'id' : 'reinforceLink',
        'test' : function() {
            return Object.keys(findTargets('reinforce')).length > 0
        }
    },
    'end' : {
        'onclick' : 'endTurn();',
        'text' : 'End turn',
        'id' : 'endLink'
    }
};

function printActions(menus) {
    var toPrint = '';
    switch(menus) {
        case 'all':
            for(var a in actions) {
                if('test' in actions[a]) {
                    if (actions[a].test()) {
                        toPrint += '<a href="#" class="button small gap" onclick="' + actions[a].onclick + '" id="' + actions[a].id + '">';
                        toPrint += actions[a].text + '</a>';
                    }
                } else { // if it doesn't have a test to pass, print it
                    toPrint += '<a href="#" class="button small gap" onclick="' + actions[a].onclick + '" id="' + actions[a].id + '">';
                    toPrint += actions[a].text + '</a>';
                }
            }
            break;
    }
    printer(toPrint, 'actions');
}

function printUnits(units, region, context, test) {
    var printing = '<h3>' + regions[region].full_name + '</h3><a class="button small gap" onclick="flipAll(\'' + region + '\',\'none\');">none</a><a class="button small gap" onclick="flipAll(\'' + region + '\',\'all\');">all</a>';
    printing += '<table border="1"><thead><th><th>Unit name<th>Exp</thead><tbody>';

    var printedAny = false;
    for(var i=0, unit; unit = units[i]; i++) {
        if(test(unit)) {
            printing += '<tr><td><input type="checkbox" name="attacker" id="' + unit.id + '"';

            // leave the first unit unchecked by default:
            if(printedAny) {
                printing += ' checked="checked"';
            } else {
                printedAny = true;
            }

            printing += '><td><label for="' + unit.id + '">Unit ' + unit.id + '<td>' + unit.experience + '</label></tr>';
        }
    }
    printing += '</tbody></table>';
    return printing;
}

function add_units(qty, location) {
    for(var i=0; i < qty; i++) {
      var blank_unit = {
  			'id' : counter,      // unique identifier
  			'experience' : 0,	// how many turns it's been alive
        'available' : true,  // if it can move/attack this round
        'knowledge' : {}   // terrain familiarity
  		};
      blank_unit.knowledge[location] = 1;
  		regions[location]['units'].push(blank_unit);
  		counter += 1;
    }
    relabel(location);
}

function kill_unit(population) {
  // populate the lottery
  var lottery = [];
  for(var i=0, unit; unit = population[i]; i++) {
    lottery.push(i);
    for(var j=0; j < unit.experience; j++) {
      lottery.push(i);
    }
  }

  var survivors = [];
  // draw "winners" from the lottery, that didn't die:
  while(survivors.length < (population.length - 1)) {
    var winner = lottery[Math.floor(Math.random() * lottery.length)];
    // check if the winner's in there
    var isNew = true;
    for(var i=0, check; check = survivors[i]; i++) {
        if(check == winner) {
            isNew = false;
        }
    }
    // if it's new, add it to the list of survivors:
    if(isNew) {
      console.log("Adding " + winner + " to survivors");
      survivors.push(winner);
    }
  }
  // find the non-survivor in the region's total population and kill it
  for(var i=0, unit; unit = population[i]; i++) {
    var survivor = false;
    for(var j=0, check; check = survivors[j]; j++) {
      if(check === unit) {
        survivor = true;
        break;
      }
    }
    if(!survivor) {
      console.log("Killing " + population[i].id);
      var find = locateUnit(population[i].id);
      regions[find.region].units.splice(find.position,1);
      // take it out of the population list and send it back
      population.splice(i, 1);
      break;
    }
  }
  return population;
}

function findTargets(purpose) {
    // enemy regions neighbored by player regions
    var attackable = regionsearch(regions, function(region) {
        /* figure out whether we're looking for player-owned regions (reinforce)
                or enemy-owned ones (attack) */
        var toEval = false;
        if(purpose == 'attack' && region.control != player) {
            toEval = true;
        } else if (purpose == 'reinforce' && region.control == player) {
            toEval = true;
        }

        if(toEval) {
            // check in an enemy's region's neighbors for available attackers
            var potential = false;
            for(var i=0, target; target = regions[region.attackable[i]]; i++) {
                if(target.control == player) {
                    var hasSpare = false;
                    for(var j=0, unit; unit = target.units[j]; j++) {
                        if(unit.available) {
                            if(hasSpare) {
                                return true;
                            } else {
                                hasSpare = true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    });

    return attackable;
}

function attackTarget() {
    var toPrint = '<h2>Attacking</h2>You can attack any of these regions:<ul>';
    var attackable = findTargets('attack');
    for(var region in attackable) {
        toPrint += '<a href="#" class="button gap" onclick="attackUnits(\'' + region + '\');">' + regions[region].full_name + '</a>';
    }
    toPrint += '</ul>';

    printer(toPrint, 'currentMenu');
}

function reinforceTarget() {
    var toPrint = '<h2>Reinforcing</h2>You can reinforce any of these regions:<ul>';
    var reinforcable = findTargets('reinforce');
    for(var region in reinforcable) {
        toPrint += '<a href="#" class="button gap" onclick="reinforceUnits(\'' + region + '\');">' + regions[region].full_name + '</a>';
    }
    toPrint += '</ul>';
    printer(toPrint, 'currentMenu')
}

function attackUnits(target) {
    var toPrint = '<h2>Attacking ' + regions[target].full_name + '</h2>Select the units to attack with:<a href"#" class="button gap" onclick="attack(\'' + target + '\');">ATTACK</a>';

    var potentialNeighbors = {};
    for(var i=0, neighbor; neighbor = regions[target].attackable[i]; i++) {
        potentialNeighbors[regions[target].attackable[i]] = regions[regions[target].attackable[i]];
    }
    // find the neighbors with available units
    var attackNeighbors = regionsearch(potentialNeighbors, function(region) {
        if(region.control == player) {
            var potential = false;
            var hasSpare = false;
            for(var j=0, unit; unit = region.units[j]; j++) {
                if(unit.available) {
                    if(hasSpare) {
                        potential = true;
                    } else {
                        hasSpare = true;
                    }
                }
            }
            return potential;
        } else {
            return false;
        }
    });

    for(var neighbor in attackNeighbors) {
        toPrint += printUnits(regions[neighbor].units, neighbor, 'attack', function(u) {
            return u.available;
        });
    }

    printer(toPrint, 'currentMenu');
}

function reinforceUnits(target) {
    var toPrint = '<h2>Reinforcing ' + regions[target].full_name + '</h2>Select the units to send over:</h2>';
    toPrint += '<a href="#" class="button gap" onclick="reinforce(\'' + target + '\');">REINFORCE</a>';

    var potentialNeighbors = {};
    for(var i=0, neighbor; neighbor = regions[target].attackable[i]; i++) {
        potentialNeighbors[regions[target].attackable[i]] = regions[regions[target].attackable[i]];
    }
    // find the neighbors with available units
    var reinforceNeighbors = regionsearch(potentialNeighbors, function(region) {
        if(region.control == player) {
            var potential = false;
            var hasSpare = false;
            for(var j=0, unit; unit = region.units[j]; j++) {
                if(unit.available) {
                    if(hasSpare) {
                        potential = true;
                    } else {
                        hasSpare = true;
                    }
                }
            }
            return potential;
        } else {
            return false;
        }
    });

    for(var neighbor in reinforceNeighbors) {
        toPrint += printUnits(regions[neighbor].units, neighbor, 'reinforce', function(thing) {
            return thing.available;
        });
    }
    printer(toPrint, 'currentMenu');
}

function attack(target) {
    // wrangle up all the attacking units
    attackers = []; // NOT a local variable: used by garrison()
    var unitBoxes = document.getElementsByName('attacker');
    for(var i=0, box; box = unitBoxes[i]; i++) {
        if(box.checked) {
            // add the selected unit to the list of attackers
            var find = locateUnit(box.id);
            //increment the attacker's experience too
            regions[find.region].units[find.position].experience++;
            regions[find.region].units[find.position].available = false; // that's the unit's move this turn
            attackers.push(regions[find.region].units[find.position]);
        }
    }
    var defenders = regions[target].units;

    // THE BATTLE HAPPENS HERE ----------------
    var original_attackers = attackers.length;
    var original_defenders = defenders.length;
    while(attackers.length > 0 && defenders.length > 0) {
        var attackExp = battleScore(attackers, 'attacking', target);
        var defendExp = battleScore(defenders, 'defending', target);
        var dice = Math.floor(Math.random() * (attackExp + defendExp));
        console.log('Attacker Odds: ' + attackExp/(attackExp + defendExp));
        if(dice > attackExp) {
            console.log('attacker dies');
            attackers = kill_unit(attackers);
        } else {
            console.log('defender dies');
            defenders = kill_unit(defenders);
        }
    }
    if(attackers.length == 0) {
        toPrint = 'Attack failed: All ' + original_attackers + ' attackers killed, after defeating ' + (original_defenders - defenders.length) + ' of the region\'s ' + original_defenders + '  defenders.';
        printer('', 'currentMenu');
    } else {
        toPrint = 'Attack successful! All ' + original_defenders + ' defenders eliminated, after killing ' + (original_attackers - attackers.length) + ' of your ' + original_attackers + ' attacking units.';
    }
    printer(toPrint, 'status');

    if(defenders.length == 0) { // if the attack was successful
        regions[target].control = player;
        garrisonUnits(attackers, target);
    }
    relabel(target);
    for(var i=0, region; region = regions[target].attackable[i]; i++) {
        relabel(region);
    }
}

function battleScore(units, action, target) {
    var totalExp = 0;
    for(var i=0, unit; unit = units[i]; i++) {
      var knowledgeBonus = 1;
      if(target in unit.knowledge) {
        knowledgeBonus = 1 + (.03 * unit.knowledge[target]);
        console.log("Bonus awarded: " + knowledgeBonus);
      }
      totalExp += unit.experience * knowledgeBonus;
    }
    totalExp += units.length; // bonus for acting in groups
    totalExp += 80; // 'universal dilution' so EXP isn't the SOLE decider

    if(action == 'defending') {
        totalExp = totalExp * 1.5;
    }
    return totalExp;
}

function locateUnit(uID) {
  var result = {};
  for(var r in regions) {
      for(var i=0, potential; potential = regions[r].units[i]; i++) {
          if(potential.id == uID) {
              result.region = r;
          }
      }
  }
  if(!result) {
    console.log("ERROR: Was searching for uID " + uID + " but could not locate its region.");
    return false;
  } else {
    for(var i=0, potential; potential = regions[result.region].units[i]; i++) {
        if(potential.id == uID) {
            result.position = i;
        }
    }
    return result;
  }
}

function garrisonUnits(attackers, target) {
    printActions('none');
    var toPrint = '<h2>Garrison</h2>You need to place at least one unit in your newly captured region: <a href="#" class="button" onclick="garrison(\'' + target + '\');">Garrison</a><ul>';
    toPrint += '<table border="1"><thead><th>Unit name<th>Exp<th>Origin';

    // find all the neighboring regions
    var neighbors = {};
    neighbors[target] = regions[target];
    for(var i=0, neighbor; neighbor = regions[target].attackable[i]; i++) {
        neighbors[neighbor] = regions[neighbor];
    }
    // whittle it down to just player-controlled regions:
    neighbors = regionsearch(neighbors, function(r) {
        return r.control == player
    });
    for(var n in neighbors) {
        toPrint += '<th>' + n;
    }
    toPrint += '</thead><tbody>';

    for(var i=0, attacker; attacker = attackers[i]; i++) {
        toPrint += '<tr><td>Unit ' + attacker.id + '<td>' + attacker.experience;
        // find where the unit's from:
        var origin = locateUnit(attacker.id).region;
        toPrint += '<td>' + origin;

        for(var n in neighbors) {
            toPrint += '<td><input type="radio" name="' + attacker.id + '" value="' + n + '"';
            if(n == origin) {
                toPrint += ' checked="checked"';
            }
            toPrint += '>';
        }

        toPrint += '</tr>';
    }
    toPrint += '</tbody></table>';

    printer(toPrint, 'currentMenu');
}

function garrison(target) {
    // find out where everyone's supposed to go
    for(var i=0, attacker; attacker = attackers[i]; i++) {
        var locations = document.getElementsByName(attacker.id);
        for(var j=0, location; location = locations[j]; j++) {
            if(location.checked) {
                var destination = location.value;
                var find = locateUnit(attacker.id);
                regions[find.region].units[find.position].available = false; // that's the unit's move this turn
                regions[destination].units.push(regions[find.region].units[find.position]);
                regions[find.region].units.splice(find.position,1);
                relabel(destination);
                relabel(find.region);
            }
        }
    }

    // make sure they actually put a unit over there
    if(regions[target].units.length == 0) {
        printer('You must station at least one unit in ' + regions[target].full_name + '.', 'alarm');
    } else {
        relabel(target);
        printer('Troops stationed.', 'status');
        printer('', 'currentMenu')
        printActions('all');
    }
}

function reinforce(target) {
    // wrangle up all the reinforcing units
    var unitBoxes = document.getElementsByName('attacker');
    var backupRegions = jQuery.extend(true, {}, regions); // :-(
    var reinforcedFrom = [];
    for(var i=0, box; box = unitBoxes[i]; i++) {
        if(box.checked) {
            // add the selected unit to the list of attackers
            var find = locateUnit(box.id);
            reinforcedFrom.push(find.region);
            //increment the attacker's experience too
            regions[find.region].units[find.position].available = false; // that's the unit's move this turn
            regions[target].units.push(regions[find.region].units[find.position]);
            regions[find.region].units.splice(find.position,1);
            relabel(find.region);
        }
    }
    // check to make sure player left at least one unit behind
    var complete = true;
    for(var i=0, origin; origin = regions[reinforcedFrom[i]]; i++) {
        if(origin.units.length == 0) {  // if we find an empty region
            var complete = false;
            regions = jQuery.extend(true, {}, backupRegions) // reset the changes
            // relabel everything
            for(var j=0, toLabel; toLabel = reinforcedFrom[j]; j++) {
                relabel(toLabel);
            }
            printer('You need to leave at least one unit in ' + origin.full_name + '.', 'alarm');
            break;
        }
    }
    if(complete) {
        relabel(target);
        printer('Troops stationed.', 'status');
        printer('', 'currentMenu')
        printActions('all');
    }
}

function checkForWin() {
    // Check if the game's over:
    var enemyControlled = regionsearch(regions, function(region) {
        return region.control != player;
    });
    if(Object.keys(enemyControlled).length === 0) {
        endGame(player);
    }
}

function endTurn() {
    // Flip the current player
    if(player == 'Rebels') {
        player = 'Govt';
    } else {
        player = 'Rebels';
    }

    printer(player + ' turn','turn');

    // make everyone available again,
    // add experience and stuff
    for(var r in regions) {
        for(var u in regions[r].units) {
            regions[r].units[u].experience++;
            regions[r].units[u].available = true;
            if(r in regions[r].units[u].knowledge) {
              regions[r].units[u].knowledge[r]++;
            } else {
              regions[r].units[u].knowledge[r] = 1;
            }
        }
    }

    // start the next player's turn
    printer('','status');
    printer('', 'currentMenu')
    distributeUnits(3);
}

function distributeUnits(available) {
    // if the player has researched planes:
    if(players[player].airplanes) {
        printActions('none');
        var toPrint = '<h2>Distribute new units</h2>' +
        '<p>You have <strong><span id="available">' + available + '</span></strong> additional units available.<p>You can send reinforcements to any of the following regions:<table cellpadding="5">';

        // find the regions under our control with an available unit
        var attackSources = regionsearch(regions, function(region) {
            return region.control == player;
        });

        for(var place in attackSources) {
            toPrint += '<tr><td>' + regions[place].full_name + '<td><button onclick="distribClick(\'-1\',\'' + place + '\');">-</button> <span name="destination" id="' + place + '">0</span> <button onclick="distribClick(\'1\',\'' + place + '\');">+</button><br>';
        }
        toPrint += '</table><button onclick="distribute(\'' + available + '\');">Reinforce</button>';
        printer(toPrint, 'currentMenu');
    } else {    // otherwise, just send reinforcements to a random region
        var owned = []; // list of NAMES of owned regions, which is why
                        // regionsearch() won't work.
        for(var r in regions) {
            if(regions[r].control == player) {
                owned.push(r);
            }
        }
        reinforced = owned[(Math.floor(Math.random() * owned.length))]
        toPrint = 'NEW TURN: ' + available + ' new units have been recruited in ' + regions[reinforced].full_name;
        printer(toPrint, 'status');
        add_units(available, reinforced);
    }

}

function distribute(available) {
    // NOTE: This function is only used if the player has researched
    // airplanes and thus had the choice of where the reinforcements
    // are sent.

    // wrangle up all the boxes
    var orders = document.getElementsByName('destination');
    var toPrint = '';
    for(var i=0, order; order = orders[i]; i++) {
        if(parseInt(order.innerHTML)) {
            add_units(parseInt(order.innerHTML), order.id);
            available = available - parseInt(order.innerHTML);
            toPrint += parseInt(orders[i].innerHTML) + ' troops sent to ' + regions[order.id].full_name + '. ';
        }
    }
    printer(toPrint, 'status');
    if(available == 0) {
        printer('', 'currentMenu');
        printActions('all');
    } else {
        distributeUnits(available);
    }
}

function distribClick(qty,target) {
    qty = parseInt(qty);
    var available = parseInt(document.getElementById('available').innerHTML) - qty;

    var newQty = parseInt(document.getElementById(target).innerHTML) + qty;

    // if it's a valid command
    if(available >= 0 && newQty >= 0) {
        document.getElementById('available').innerHTML = available;
        document.getElementById(target).innerHTML = newQty;
    }
}

function endGame(winner) {
    printer('<h1>' + winner + ' WINS!</h1>','turn');
    printer('','status');
    printer('','currentMenu');
    printActions('none');
}

function flipAll(region,state) {
    var inputs = document.getElementsByTagName('input');
    for(var i=0, input; input = inputs[i]; i++) {
        if(locateUnit(input.id).region == region) {
            if(state == 'none') {
                input.checked = false;
            } else {
                input.checked = true;
            }
        }
    }
}
