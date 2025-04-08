import { FC } from "react"
import { Button } from "@/components/ui/button";

export interface IGedung {
    image : string;
    title : string;
    price : number;    
}

const CardGedung : FC<IGedung> = ({image,title,price})=>{
    return(
        <div className="p-2 shadow-2xl rounded-xl space-y-4">
            <img src={image} alt={image} />
            <div>
                <h3>{title}</h3>
                <h3>Rp. {price}</h3>
            </div>
            <Button>
                Detail Gedung
            </Button>
        </div>
    )
}

export default CardGedung