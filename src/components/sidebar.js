export default function Sidebar({ icon }) {
    let display = Object.keys(icon).toString();

    return (
        <div id="sidebar">
            <img id="icon" className={display} src={icon[display]} alt="Image portraying current weather state." />
        </div>)
}
//OLD
//    const conditions = ['sun', 'rain', 'cloud', 'storm', 'snow'];
//    const [iconClass, setIconClass] = useState('loading');
    //const [condition, setCondition] = useState('loading');
    //make useState or the class of the image and add the rotating loading image to it or, make it a gif in the report file

/*useEffect(() => {
    if (icon) {
        for (let wordInd in conditions) {
            if (icon.includes(conditions[wordInd])) {
                setIconClass(conditions[wordInd]);
            }
        }
    }
   
}, [icon]);
//borderClass is getting set to correct icon, but condition is not
*/