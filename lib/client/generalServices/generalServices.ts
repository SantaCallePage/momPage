export function capitalizeAllSentence(sentence:string){
    const titleCased = sentence
  .split(' ')
  .map(word => (word!="de" ? word.charAt(0).toUpperCase() + word.slice(1) : word))
  .join(' ');

 return titleCased;
}