import '../components_css/menu.css';
import { useState, useRef, useContext, useEffect } from 'react';
import { socketContext } from './MyContext';

export const Menu = () => {

    const socket = useContext(socketContext);

    type groupListObj = {
        groupName: string,
        groupImage: Blob,
        src?: string
    }

    const groupDiv = useRef<HTMLDivElement>(null);
    const [grpLeft, setGrpLeft] = useState(0);
    const [commLeft, setCommLeft] = useState(0);
  
    // =====ALL GROUPS=====
    const [groups, setGroups] = useState<groupListObj[][]>([]);

    // =====GET GROUPS=====
    useEffect(() => {

        const arrangeData = (data: groupListObj[]) => {

            data.forEach(group => {
                const blob = new Blob([group.groupImage], { type: 'image/png' });
                group['src'] = URL.createObjectURL(blob);
            });

            const allGroups: groupListObj[][] = [];
            while(data.length > 0){

               const chunkSize = Math.min(3, data.length);
               allGroups.push(data.slice(0, chunkSize));
               data.splice(0, chunkSize);

            }

            setGroups(allGroups);

        }

        socket.emit('get-groups', );
        socket.on('groupList', (groupList: groupListObj[]) => {
            arrangeData(groupList);
        });

        return () => {
            socket.off('groupList');
        }

    },[])

    // =====SLIDE FUNCTION=====
    const slide = (direction: 'left' | 'right', variable: any) => {
        // SLIDE LEFT
        if(direction == 'left'){
            variable((prev: number) => {
                if(prev != ((groups.length-1) * 100)){
                    return prev + 100
                } 
                return prev;
            });
        }
        // SLIDE RIGHT
        if(direction == 'right'){
            variable((prev: number) => {
                if(prev != 0){
                    return prev - 100
                }
                return prev
            });
        }

    }

    // =====CREATE GROUP/COMMUNITY FUNCTION
    const create = (creation: 'group' | 'community') => {
        creation == 'group' && socket.emit('new-group');
        creation == 'community' && socket.emit('new-community');
    }



    //=====JSX=====
    return (
        <>
            <div id="menu-container">

                {/* =====CREATE COMMUNITY/GROUP SECTION===== */}
                <section id='create'>
                    <div className='group'>New group</div>
                </section>





                {/* =====GROUP SECTION===== */}
                <section id="groups">
                    <h1>Groups</h1>
                    <div id='groups-div' ref={groupDiv} className='cluster-div' style={{marginLeft: `-${grpLeft}%`}}>
                        {groups.map((group, index) => (
                            <div className='grp-cluster' key={index}>
                                {group.map((grp, index) => (
                                 <div className='group' key={`grp${index}`}>
                                    <img className='grp-image' src={`${grp.src}`} alt="" loading='lazy' />
                                    <p>{grp.groupName}</p>
                                 </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div id="buttons">
                        <button onClick={() => slide('left', setGrpLeft)}>{'<'}</button>
                        <button onClick={() => slide('right', setGrpLeft)}>{'>'}</button>
                    </div>
                </section>

            </div>
        </>
    )
}