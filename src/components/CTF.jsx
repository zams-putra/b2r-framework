import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AnimatePresence, motion } from "motion/react";
import Panel from "./Panel";

export default function CTF({ data }) {


  const [selectedNode, setSelectedNode] = useState(null)
  const handleNodeCLick = (nodeData) => {
    if(nodeData.children || nodeData._children) {
      toggleNode(nodeData)
    } else if (nodeData.content) {
      setSelectedNode(nodeData)
    }
  }
  
  
  const svgRef = useRef();

  const [treeData, setTreeData] = useState(() => {
    const clone = structuredClone(data);

    let count = 0
    function assignId(node) {
      node.id = count++
      node.children?.forEach(assignId)
    }
    assignId(clone)
    

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
      if (node.id === target.id) {
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
    .nodeSize([80, 100])          // [vertical spacing antar node, horizontal jarak antar level]
    .separation((a, b) => a.parent === b.parent ? 1 : 1.2)(root);

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

  const offsetX = 100;   // margin kiri
  const offsetY = height / 2; 

  return (
    <div className="relative">

      <svg className="w-screen h-screen"
      ref={svgRef}
      width={width}
      height={height}
      style={{
        background:"#222831",
        cursor:"grab"
      }}
    >

     <g className="main" transform={`translate(${offsetX},${offsetY})`}>

      {links.map((link, i) => (
        <path key={i} d={linkGenerator(link)} fill="none" stroke="#444" />
      ))}

      <AnimatePresence mode="sync">
        {nodes.map((node) => (
          <motion.g
            key={node.data.id} 
            transform={`translate(${node.y},${node.x})`}
            style={{ cursor: "pointer" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => handleNodeCLick(node.data)}
          >
            <circle r={12} fill={node.data._children ? "#EEEEEE" : "#00ADB5"} />
            <text
              fill="white"
              x={0}
              y={28}
              fontSize={12}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {node.data.name}
            </text>
          </motion.g>
        ))}
      </AnimatePresence>

    </g>
      </svg>


      <Panel node={selectedNode} onClose={() => setSelectedNode(null)}/>
      
    </div>
  );
}