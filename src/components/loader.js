import icon from '../image_files/loading.gif';

export default function Loading() {
    return (
        <div id="loading-div" className='Background'>
            <img className='loading' src={icon} />
        </div>
        )
}
