import { FC } from "react";
import { IGedung } from "./card-gedung";
import CardGedung from "./card-gedung";

interface IGedungListProps {
  dataGedung: IGedung[];
}

const CardListGedung: FC<IGedungListProps> = ({ dataGedung }) => {
  return (
    <>
      {dataGedung.map((data, index) => {
        <div key={index}>
          <CardGedung
            image={data.image}
            title={data.title}
            price={data.price}
          />
          ;
        </div>;
      })}
    </>
  );
};

export default CardListGedung;
