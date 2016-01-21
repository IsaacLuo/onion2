/**
 * Created by Isaac on 20/01/2016.
 */

export var compareProps = function(props1, props2, list){
    if(list==undefined){
        list = Object.keys(props1);
    }
    for(let item of list){
        if(!props2){
            return false;
        }
        if(typeof(props1[item])=="object"){
            let subre = compareProps(props1[item],props2[item]);
            if(!subre) return subre;
        }
        else if(typeof(props1[item])=="function"){}
        else {
            if (props1[item] != props2[item]) {
                //console.warn("different", item,props1[item],props2[item],props1,props2)
                return false;
            }
        }
    }
    return true;
}

export var comparePropsDebug = function(props1, props2, list){
    if(list==undefined){
        list = Object.keys(props1);
    }
    console.log("comparing",props1,props2);
    for(let item of list){
        console.log("item=",item,typeof(item))
        if(typeof(props1[item])=="object"){
            let subre = comparePropsDebug(props1[item],props2[item]);
            if(!subre){
               // console.log("differentobj", item,props1[item],props2[item])
                return subre;
            }
        }
        else if(typeof(props1[item])=="function"){}
        else {
            console.log("ccc",item, props1[item],props2[item])
            if (props1[item] != props2[item]) {
                console.warn("different", item,props1[item],props2[item],props1,props2)
                return false;
            }
        }
    }
    return true;
}
