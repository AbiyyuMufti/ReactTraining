const GridHeader = (props: { heading: string[] }) => {
  return (
    <tr>
      {props.heading.map((col, idx) => (
        <th key={idx}>{col}</th>
      ))}
    </tr>
  );
};

export default GridHeader;
