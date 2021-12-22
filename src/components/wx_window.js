export default function WxWindow({ icon }) {
    let display = Object.keys(icon).toString();

    return (
        <div id="wx-window">
            <img id="icon" className={display} src={icon[display]} alt="Window of current weather state." />
        </div>)
}