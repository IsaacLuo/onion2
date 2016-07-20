/**
 * Created by Isaac on 20/01/2016.
 */

export function compareProps(props1, props2, list) {
  if(props1==null && props2==null) {
    return true; //if two elements both null return yes
  } else if (props1 == null || props2 == null){
    return false;
  }

  try {
    if (!list && typeof (props1) === 'object') {
      list = Object.keys(props1);
    }

    for (const item of list) {
      if (!props2) {
        return false;
      }

      if (typeof (props1[item]) === 'object') {
        const subre = compareProps(props1[item], props2[item]);
        if (!subre) return subre;
      } else if (typeof (props1[item]) !== 'function') {
        if (props1[item] !== props2[item]) {
          //console.warn("different", item,props1[item],props2[item],props1,props2)
          return false;
        }
      }
    }
  } catch(err) {
    console.error(err,props1, props2, list);
    return false;
  }

  return true;
}

export function comparePropsDebug(props1, props2, list = Object.keys(props1)) {
  console.log('comparing', props1, props2);
  for (const item of list) {
    console.log('item=', item, typeof (item));
    if (typeof (props1[item]) === 'object') {
      const subre = comparePropsDebug(props1[item], props2[item]);
      if (!subre) {
        // console.log("differentobj", item,props1[item],props2[item])
        return subre;
      }
    } else if (typeof (props1[item]) !== 'function') {
      console.log('ccc', item, props1[item], props2[item]);
      if (props1[item] !== props2[item]) {
        console.warn('different', item, props1[item], props2[item], props1, props2);
        return false;
      }
    }
  }

  return true;
}
