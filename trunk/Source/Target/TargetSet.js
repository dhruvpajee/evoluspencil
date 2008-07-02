function TargetSet(canvas, targets) {
    this.canvas = canvas;
    this.targets = targets;    

    var propertyGroup = new PropertyGroup();
    propertyGroup.name = "Properties";
    
    var firstGroups = this.targets[0].getPropertyGroups();
    
    for (g in firstGroups) {
        for (p in firstGroups[g].properties) {
            var propDef = firstGroups[g].properties[p];
            
            var ok = true;
            for (var i = 1; i < this.targets.length; i++) {
                var target = this.targets[i];
                var propGroups = target.getPropertyGroups();
                
                var found = false;
                for (g1 in propGroups) {
                    for (p1 in propGroups[g1].properties) {
                        var def = propGroups[g1].properties[p1];
                        
                        if (propDef.isSimilarTo(def)) {
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                
                if (!found) {
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            
            propertyGroup.properties.push(propDef);
        }
    }
    this.propertyGroup = propertyGroup;
}
TargetSet.prototype.isFor = function (svg) {
    return false;
};
TargetSet.prototype.getProperties = function () {
    var properties = {};
    for (var p in this.propertyGroup.properties) {
        var name = this.propertyGroup.properties[p].name;
        properties[name] = this.getProperty(name);
    }
    
    return properties;
};
TargetSet.prototype.setInitialPropertyValues = function () {
};
TargetSet.prototype.applyBehaviorForProperty = function (name) {
};
TargetSet.prototype.getPropertyGroups = function () {
    return [this.propertyGroup];
};
TargetSet.prototype.setProperty = function (name, value) {
    for (t in this.targets) {
        this.targets[t].setProperty(name, value);
    }
};
TargetSet.prototype.getProperty = function (name, any) {
    if (name == "box") return null;
    var firstValue = this.targets[0].getProperty(name);
    if (!firstValue) return null;
    
    if (any) return firstValue;
    
    var same = true;
    for (var i = 1; i < this.targets.length; i ++) {
        var target = this.targets[i];
        var value = target.getProperty(name);
        
        if (value == null) return null;
        if (firstValue.toString() != value.toString()) {
            same = false;
            break;
        }
    }
    
    return same ? firstValue : null;
};
TargetSet.prototype.locatePropertyNode = function (name) {
    return null;
};
TargetSet.prototype.storeProperty = function (name, value) {
};
TargetSet.prototype.getGeometry = function () {
    return null;
};
TargetSet.prototype.getBoundingRect = function () {
    return null;
};
TargetSet.prototype.setGeometry = function (geo) {
};

TargetSet.prototype.moveBy = function (x, y, zoomAware) {
    for (i in this.targets) this.targets[i].moveBy(x, y, zoomAware ? true : false);
};

TargetSet.prototype.setPositionSnapshot = function () {
    for (i in this.targets) this.targets[i].setPositionSnapshot();
};
TargetSet.prototype.moveFromSnapshot = function (dx, dy) {
    for (i in this.targets) this.targets[i].moveFromSnapshot(dx, dy, "dontNormalize");
};
TargetSet.prototype.clearPositionSnapshot = function () {
    for (i in this.targets) this.targets[i].clearPositionSnapshot();
};


TargetSet.prototype.getName = function () {
    return "Multiple objects";
};
TargetSet.prototype.deleteTarget = function () {
    for (i in this.targets) this.targets[i].deleteTarget();
};
TargetSet.prototype.alignLeft = function () {
    var mostTarget = null;
    var most = Number.MAX_VALUE;
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (rect.x < most) {
            most = rect.x;
            mostTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == mostTarget) continue;
        var rect = this.targets[i].getBoundingRect();
        var delta = most - rect.x;
        this.targets[i].moveBy(Math.round(delta), 0, true);
    }
    this.canvas.invalidateEditors();
};


TargetSet.prototype.alignTop = function () {
    var mostTarget = null;
    var most = Number.MAX_VALUE;
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (rect.y < most) {
            most = rect.y;
            mostTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == mostTarget) continue;
        var rect = this.targets[i].getBoundingRect();
        var delta = most - rect.y;
        this.targets[i].moveBy(0, Math.round(delta), true);
    }
    this.canvas.invalidateEditors();
};


TargetSet.prototype.alignCenter = function () {
    var most = Number.MAX_VALUE;
    var farest = 0 - Number.MAX_VALUE;
    
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (rect.x < most) {
            most = rect.x;
        }
        if (farest < rect.x + rect.width) {
            farest = rect.x + rect.width;
        }
    }
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        var delta = (farest - most - rect.width) / 2 + most - rect.x;
        this.targets[i].moveBy(Math.round(delta), 0, true);
    }
    this.canvas.invalidateEditors();
};

TargetSet.prototype.alignMiddle = function () {
    var most = Number.MAX_VALUE;
    var farest = 0 - Number.MAX_VALUE;
    
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (rect.y < most) {
            most = rect.y;
        }
        if (farest < rect.y + rect.height) {
            farest = rect.y + rect.height;
        }
    }
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        var delta = (farest - most - rect.height) / 2 + most - rect.y;
        this.targets[i].moveBy(0, Math.round(delta), true);
    }
    this.canvas.invalidateEditors();
};

TargetSet.prototype.alignRight = function () {
    var farestTarget = null;
    var farest = 0 - Number.MAX_VALUE;
    
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (farest < rect.x + rect.width) {
            farest = rect.x + rect.width;
            farestTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == farestTarget) continue;
        var rect = this.targets[i].getBoundingRect();
        var delta = farest - rect.width - rect.x;
        this.targets[i].moveBy(Math.round(delta), 0, true);
    }
    this.canvas.invalidateEditors();
};


TargetSet.prototype.alignBottom = function () {
    var farestTarget = null;
    var farest = 0 - Number.MAX_VALUE;
    
    for (var i in this.targets) {
        var rect = this.targets[i].getBoundingRect();
        if (farest < rect.y + rect.height) {
            farest = rect.y + rect.height;
            farestTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == farestTarget) continue;
        var rect = this.targets[i].getBoundingRect();
        var delta = farest - rect.height - rect.y;
        this.targets[i].moveBy(0, Math.round(delta), true);
    }
    this.canvas.invalidateEditors();
};
TargetSet.prototype.makeSameWidth = function () {
    var mostTarget = null;
    var most = Number.MIN_VALUE;
    for (var i in this.targets) {
        var box = this.targets[i].getProperty("box");
        if (!box) continue;
        if (box.w > most) {
            most = box.w;
            mostTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == mostTarget) continue;
        
        var box = this.targets[i].getProperty("box");
        if (!box) continue;
        
        box.w = most;
        this.targets[i].setProperty("box", box);
    }
    this.canvas.invalidateEditors();
};
TargetSet.prototype.makeSameHeight = function () {
    var mostTarget = null;
    var most = Number.MIN_VALUE;
    for (var i in this.targets) {
        var box = this.targets[i].getProperty("box");
        if (!box) continue;
        if (box.h > most) {
            most = box.h;
            mostTarget = this.targets[i];
        }
    }
    for (var i in this.targets) {
        if (this.targets[i] == mostTarget) continue;
        
        var box = this.targets[i].getProperty("box");
        if (!box) continue;
        
        box.h = most;
        this.targets[i].setProperty("box", box);
    }
    this.canvas.invalidateEditors();
};




TargetSet.prototype.bringForward = function () {
    for (i in this.targets) this.targets[i].bringForward();
};
TargetSet.prototype.bringToFront = function () {
    for (i in this.targets) this.targets[i].bringToFront();
};
TargetSet.prototype.sendBackward = function () {
    for (i in this.targets) this.targets[i].sendBackward();
};
TargetSet.prototype.sendToBack = function () {
    for (i in this.targets) this.targets[i].sendToBack();
};
TargetSet.prototype.createTransferableData = function () {
    var node = this.canvas.ownerDocument.createElementNS(PencilNamespaces.svg, "g");
    for (i in this.targets) node.appendChild(this.targets[i].createTransferableData().dataNode);
    
    return {type: TargetSetXferHelper.MIME_TYPE,
            dataNode: node
           };
};
TargetSet.prototype.lock = function () {
    for (i in this.targets) if (this.targets[i].lock) this.targets[i].lock();
};
TargetSet.prototype.markAsMoving = function (moving) {
    for (i in this.targets) this.targets[i].markAsMoving(moving);
};


