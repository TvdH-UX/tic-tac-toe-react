export default function log({ turns }) {
  return (
    <ol id="log">
      {turns.map((turn) => (
        <li key={`${turn.field.row}${turn.field.col}`}>
          {turn.player} selected {turn.field.row}, {turn.field.col}
        </li>
      ))}
    </ol>
  );
}
