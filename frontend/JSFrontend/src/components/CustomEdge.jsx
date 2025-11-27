import {BaseEdge, EdgeLabelRenderer, getBezierPath} from "@xyflow/react";
import plusIcon from '../assets/plusIcon.svg';
import '../style/PlusButton.css'
import {useState} from "react";

export default function CustomEdge({
                                     id,
                                     sourceX,
                                     sourceY,
                                     targetX,
                                     targetY,
                                     sourcePosition,
                                     targetPosition,
                                     data
                                   }) {
  const [isHovered, setIsHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{strokeWidth: isHovered ? 3 : 2}}
        interactionWidth={20}

      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        pointerEvents="stroke"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        {isHovered && (
          <div
            className="edge-label-wrapper"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            onMouseEnter={() => setIsHovered(true)}
          >
            <button
              // onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="plus-button"
              onClick={() => data.onAddTask()}>
              <img
                src={plusIcon}
                alt="Add Task"
                className={`plus-button-icon position-center`}
              />
            </button>
          </div>

        )}
      </EdgeLabelRenderer>
    </>
  );
}
