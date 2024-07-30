import React from "react";
import { TypeIcon } from "../TypeIcon/TypeIcon";

export const CustomDragPreview = (props) => {
  const item = props.monitorProps.item;

  return (
    <div>
      <div>
        {item.droppable}
        {item?.data?.fileType}
        <TypeIcon
          item={item}
          droppable={item.droppable}
          fileType={item?.data?.fileType}
        />
      </div>
      <div>{item.text}</div>
    </div>
  );
};
