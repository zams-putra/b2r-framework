import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion } from "motion/react";

export default function CTF({ data }) {
  const svgRef = useRef();

  const [treeData, setTreeData] = useState(() => {
    const clone = structuredClone(data);

    function collapse(node) {
      if (node.children) {
        node._children = node.children;
        node.children = null;

        node._children.forEach(collapse);
      }
    }

    collapse(clone);

    clone.children = clone._children;
    clone._children = null;

    return clone;
  });

  const width = 1400;
  const height = 900;

  const toggleNode = (target) => {
    function traverse(node) {
      if (node.name === target.name) {
        if (node.children) {
          node._children = node.children;
          node.children = null;
        } else {
          node.children = node._children;
          node._children = null;
        }
      }

      node.children?.forEach(traverse);
      node._children?.forEach(traverse);
    }

    const clone = structuredClone(treeData);

    traverse(clone);

    setTreeData(clone);
  };

  const root = d3.hierarchy(treeData);

  d3.tree()
    .size([height - 100, width - 300])(root);

  const nodes = root.descendants();
  const links = root.links();

  const linkGenerator = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.call(
      d3.zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", (e) => {
          svg.select("g.main")
            .attr(
              "transform",
              e.transform
            );
        })
    );

  }, []);

  return (
    <svg className="w-screen h-screen"
      ref={svgRef}
      width={width}
      height={height}
      style={{
        background:"#000000",
        cursor:"grab"
      }}
    >

      <g className="main">

        {links.map((link,i)=>(
          <path
            key={i}
            d={linkGenerator(link)}
            fill="none"
            stroke="#444"
          />
        ))}

        {nodes.map((node,i)=>(

          <motion.g
            key={i}
            transform={`translate(${node.y},${node.x})`}
            style={{
              cursor:"pointer"
            }}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration: 1.2}}
            onClick={()=>toggleNode(node.data)}
          >

            <circle
              r={12}
              fill={
                node.data._children
                ? "#22c55e"
                : "#ddd"
              }
            />

            <text
              fill="white"
              x={20}
              y={4}
              fontSize={13}
              fontFamily="monospace"
            >
              {node.data.name}
            </text>

          </motion.g>

        ))}

      </g>

    </svg>
  );
}