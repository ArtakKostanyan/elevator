import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState} from "react";

// let DOWN = -1;
let DOWN = 'DOWN';
 let IDLE = 0;
let UP = "UP";
// let UP = 1;

function Elevator(floor, direction)
{
    this.floor = floor;
    this.direction = direction;
}

let elevators = [
    new Elevator(7, DOWN),
    new Elevator(9, UP),
    new Elevator(10, DOWN)
];
function findElevator(requestFloor, requestDirection)
{

    // holder for integer pointing to position of elevator in the array.
    // this is for best fit, approaching passenger & going in same direction
    // (given unknown destination. see above)
    let bestFit = null;

    // fallback, simply the closest.
    // start w/ a random one, so in the event that all are equally good/bad, it distributes evenly.
    let closest = Math.floor(Math.random() * elevators.length);

     // for each elevator, check if it's an efficient dispatch and how far away it is
    elevators.forEach(function(elevator, elevatorInd) {

        // is elevator approaching the passenger?
        // (implies, not yet overshot)
        // if going down, want elevator floor to be > passenger floor.  (P - E < 0)
        // if going up, want elevator floor to be < passenger floor.    (P - E > 0)
        // same floor (=) is also ok. (assuming elevator records the next floor as soon as it starts moving toward it.)
        let approachingPassenger = (
            (elevator.direction === UP && elevator.floor <= requestFloor) ||
            (elevator.direction === DOWN && elevator.floor >= requestFloor) ||
            elevator.direction === IDLE   );    // requestDirection doesn't matter if it's idle
        // (we're not worrying about additional energy/inefficiency from the accelaration of an idle elevavor.)

        console.log(approachingPassenger,'approachingPassenger')
        // already going in the same direction as the passenger wants to go?
        // (not neces most efficient, but w/o knowing the current destination, it's the best available.)
        let sameDirection = requestDirection === elevator.direction || elevator.direction === IDLE;

        // how far away? all else being equal, closer is better.
        let distance = Math.abs(requestFloor - elevator.floor);

        // best fit so far (good & closest) or first good fit
        if (approachingPassenger && sameDirection &&
            (bestFit === null || distance < Math.abs(requestFloor - elevators[bestFit].floor)) ) {
            bestFit = elevatorInd;
        }

        // fallback, closest regardless of efficiency.
        if (distance < Math.abs(requestFloor - elevators[closest].floor)) {
            closest = elevatorInd;
        }

    }); //each

    return bestFit !== null ? bestFit : closest;
}


function App() {

    const floorsPos = {
        1: ''
    }
    const floors = [1,2,3,4,5,6,7,8,9]
    const elevatorRef = useRef();
    const floorsRef = useRef();
    const requestIdRef = useRef();
    const [calledFloor,setCalledFloor]=useState([])
    const [current,setCurrent] = useState({})
    const [upFloors,setUpFloors]=useState([])
    const [downFloors,setDownFloors]=useState([])
    const [isElevatorMove,setElevatorIsMove]=useState(false)

    //
    useEffect(()=>{
        // setTimeout(()=>{
            updateElevator()
        // },1000)
        console.log('effect')
    },[upFloors.length,downFloors.length])

    useEffect(()=>{
        elevatorAnimation()

    },[current]);

    const elevatorAnimation = () => {
        let element = document.querySelector(`[data-floor='${current.id || 1}']`);
        let elev = document.querySelector(`.elevator`);

        // deltaTime = new Date().getTime()-previousTime;
        // previousTime = new Date().getTime()

        elevatorRef.current.style.offsetTop = element.offsetTop+"px";
        elevatorRef.current.animate([
            { transform: `translateY(${element.offsetTop + 'px'})` }
        ], {
            // timing options
             duration: 2000,
            fill:'forwards'
        })

        let ids='';
         if (elevatorRef.current.style.offsetTop === element.offsetTop+'px'){

             console.log('ppp')
                let newUp= upFloors.filter(item=>item===current.id)
                let array = newUp.sort();
                setUpFloors(array);

           ids= requestAnimationFrame(elevatorAnimation)
        }

          cancelAnimationFrame(ids)
       // setElevatorIsMove(true)

    }
    const updateElevator = () => {

         if (current.direction===UP){
            let array = upFloors.sort();

            let elId=''
            for (let i=0;i< array.length;i++){

                if (current.id<array[i] ){
                     // setTimeout(()=>{
                    // setInterval(()=>{
                    //     elevatorAnimation()
                    // },1000)
                      //   requestIdRef.current = requestAnimationFrame(elevatorAnimation)
                        console.log(elId,'pppp')
                      //  setCurrent({...current,id:array[i]})
                     // },2000)

                     array.splice(i,1);
                }

             }
          //  console.log(array,"eeee");
            setUpFloors(array)

            // if (downFloors.length===0){
            //     setTimeout(()=>{
            //         setCurrent({ id:1,direction:DOWN})
            //     },2000*lng)
            //
            // }

            console.log(array,'up')
        }else if(current.direction===DOWN){
            console.log(']]]]]]')
            let array = downFloors.sort();
            if (array.length===0){
                console.log('koko')
                setCurrent({...current,id:1})
            }
            for (let i=0; i < array.length;i++){

                if (current.id > array[i] ){
                    // setTimeout(()=>{
                        setCurrent({...current,id:array[i]})
                    // },0)

                     array.splice(i,1);
                }
            }
            console.log(array,'down')
           // setCurrent({...current,direction:UP})
            setDownFloors(array)
        }

        // floors.map((item)=>{
        //     console.log(item.direction,'lplp')
        //
        //     let element = document.querySelector(`[data-floor='${item.id}']`);
        //     console.log(element,'koko',)
        //
        //     setTimeout(()=>{
        //
        //     },1000)
        //
        //
        //
        // })


    }



    const handleClick = (e,id,direction) => {

        if (upFloors.length===0 && downFloors.length ===0 ){
            setCurrent({id,direction})
        }

        // if (upFloors.length===0){
        //     setCurrent({id,direction:DOWN})
        // }
        // if (downFloors.length===0){
        //     setCurrent({id,direction:UP})
        // }
        if (direction===UP){
            setUpFloors((prev)=>[...prev,id])
        }else {
             setDownFloors((prev)=>[...prev,id])
        }
        // const obj = { id:id, direction:direction };
        //
        // const exist = calledFloor.find(x => x.id === id &&  x.direction===direction)
        // if (!exist){
         //   setCalledFloor([...calledFloor,obj])
         // }
         //setTimeout(()=>{
         //    requestAnimationFrame(updateElevator);
        // },3000);

    }

    return (
    <div className="App">
        <div className="building">
            <div className="elevator-container">
                <div className="elevator"  ref={elevatorRef}>
                    <div className="elevator-door" ></div>
                    <div className="elevator-light"></div>
                </div>
            </div>
            <div className="floors" ref={floorsRef}>

                {
                    floors.map((item,idx)=>(
                         <div  key={idx} className="floor" data-floor={idx+1}>
                            <div className="floor-window">
                                <button onClick={(e)=>handleClick(e,idx+1,UP)}>Up</button>
                                <button onClick={(e)=>handleClick(e,idx+1,DOWN)}>Down</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    </div>
  );
}

export default App;
