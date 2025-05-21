import { ChatSpace } from './ChatSpace';
import { Friends } from './Friends';
import { Menu } from './Menu';



export const Chat = () => {

    return (
        <div id='container'>
            {/* <Menu /> */}
            <Friends/>
            <ChatSpace/>
        </div>
    )
}