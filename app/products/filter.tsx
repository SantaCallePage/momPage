import styles from "./productsView.module.css"

interface FilterProps{
    options:string[]
    selectedOptionSetter(selected:string):void
    currentOption:string | null
} 

export default function Filter({options, selectedOptionSetter, currentOption}:FilterProps){

    return(
        <div className={`${styles.main_container}`} >
            {
                options.map((option)=>{
                    return <button key={option} className={`${styles.option} ${ currentOption && currentOption == option ? styles.option_selected : ""}`} onClick={()=>selectedOptionSetter(option)}>{option}</button>
                })
            }
        </div>
    );
}