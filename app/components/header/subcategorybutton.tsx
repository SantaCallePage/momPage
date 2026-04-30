"use client"

interface CategoryButtonProps{
    subcategoryName:string;
    onSubcategoryClicked: (name:string) => void;
}

export default function SubcategoryButton(props:CategoryButtonProps){
    const name = props.subcategoryName;
    
    return <button onClick={() => props.onSubcategoryClicked(name.replaceAll(" ","_"))}>{name}</button>
}