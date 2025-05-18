function RoomComp({img, nome}){
    return(<>
    <div className="room">
        <img src={img}/>
        <p>{nome}</p>
    </div></>
    )
}

export default RoomComp;