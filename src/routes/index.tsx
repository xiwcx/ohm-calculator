import { Title } from "@solidjs/meta";
import { children, createSignal, JSX } from "solid-js";

const ohmage = [2, 4, 8, 16] as const;
const size = [8, 10, 12, 15] as const;
const wiring = ["parallel", "series"] as const;

type Ohmage = (typeof ohmage)[number];
type Size = (typeof size)[number];
type Wiring = (typeof wiring)[number];

type Speaker = {
  ohmage: Ohmage;
  size: Size;
};

type Row = { wriring: Wiring; speakers: Speaker[] };
type Cabinet = { wiring: Wiring; rows: Row[] };

type SpeakerProps = {
  coordinates: [number, number];
  editSpeaker: (coordinates: [number, number], speaker: Speaker) => void;
  removeSpeaker: (coordinates: [number, number]) => void;
  speaker: Speaker;
};

const Speaker = ({ speaker }: SpeakerProps) => (
  <div>
    {speaker.size} inch {speaker.ohmage} ohm
  </div>
);

type RowProps = {
  children: JSX.Element;
  addSpeaker: (rowIndex: number) => void;
  removeRow: (rowIndex: number) => void;
  row: Row;
  rowIndex: number;
};

const Row = (props: RowProps) => {
  const c = children(() => props.children);

  return (
    <div>
      <div>{c()}</div>

      <button onClick={() => props.removeRow(props.rowIndex)}>
        Remove Row
      </button>
      <button>Add Speaker</button>
    </div>
  );
};

const defaultCabinet: Cabinet = {
  wiring: "series",
  rows: [
    {
      wriring: "parallel",
      speakers: [
        { ohmage: 8, size: 12 },
        { ohmage: 8, size: 12 },
      ],
    },
    {
      wriring: "parallel",
      speakers: [
        { ohmage: 8, size: 12 },
        { ohmage: 8, size: 12 },
      ],
    },
  ],
};

export default function Home() {
  const [cabinet, setCabinet] = createSignal<Cabinet>(defaultCabinet);

  const addRow = () => {
    setCabinet((cabinet) => ({
      ...cabinet,
      rows: [...cabinet.rows, cabinet.rows[cabinet.rows.length - 1]],
    }));
  };

  const removeRow = (rowIndex: number) => {
    setCabinet((cabinet) => ({
      ...cabinet,
      rows: cabinet.rows.filter((_, i) => i !== rowIndex),
    }));
  };

  const addSpeaker = (rowIndex: number) => {
    setCabinet((cabinet) => ({
      ...cabinet,
      rows: cabinet.rows.map((r, i) =>
        i === rowIndex
          ? {
              ...r,
              speakers: [...r.speakers, r.speakers[r.speakers.length - 1]],
            }
          : r
      ),
    }));
  };

  const editSpeaker = (coordinates: [number, number], speaker: Speaker) => {
    const [x, y] = coordinates;

    setCabinet((cabinet) => ({
      ...cabinet,
      rows: cabinet.rows.map((r, i) =>
        i === y
          ? {
              ...r,
              speakers: r.speakers.map((s, j) => (j === x ? speaker : s)),
            }
          : r
      ),
    }));
  };

  const removeSpeaker = (coordinates: [number, number]) => {
    const [x, y] = coordinates;

    setCabinet((cabinet) => ({
      ...cabinet,
      rows: cabinet.rows.map((r, i) =>
        i === y
          ? {
              ...r,
              speakers: r.speakers.filter((_, j) => j !== x),
            }
          : r
      ),
    }));
  };

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>

      <div>
        {cabinet().rows.map((row, i) => (
          <Row
            addSpeaker={addSpeaker}
            removeRow={removeRow}
            row={row}
            rowIndex={i}
          >
            {row.speakers.map((speaker, j) => (
              <Speaker
                coordinates={[j, i]}
                editSpeaker={editSpeaker}
                removeSpeaker={removeSpeaker}
                speaker={speaker}
              />
            ))}
          </Row>
        ))}

        <button onClick={addRow}>Add Row</button>
      </div>
    </main>
  );
}
