import pic from "./pics/account-icon.png"
import { SidePanel, Navbar } from "./Driver.jsx";
import "./Student.css"

export default function Student(){

    //Mock Data
    const Students = [
        {
            profile_pic: pic,
            name: "Nguyễn Văn A",
            id: "HS001",
            studentClass: "3E4",
            picked_dropped_at: "Trạm C"
        },
        {
            profile_pic: pic,
            name: "Trần Thị B",
            id: "HS002",
            studentClass: "3E2",
            picked_dropped_at: "Trạm A"
        },
        {
            profile_pic: pic,
            name: "Lê Minh C",
            id: "HS003",
            studentClass: "4E1",
            picked_dropped_at: "Trạm B"
        },
        {
            profile_pic: pic,
            name: "Phạm Gia D",
            id: "HS004",
            studentClass: "5E3",
            picked_dropped_at: "Trạm B"
        },
        {
            profile_pic: pic,
            name: "Đỗ Ngọc E",
            id: "HS005",
            studentClass: "2E2",
            picked_dropped_at: "Trạm C"
        },
        {
            profile_pic: pic,
            name: "Hoàng Anh F",
            id: "HS006",
            studentClass: "3E1",
            picked_dropped_at: "Trạm A"
        }
    ];

    return (
        <div className="app">
            <Navbar />
            <div className="driver-center-box">
                <div className="driver-display-info">
                    <h2>Danh sách học sinh đưa đón</h2>
                    <div className="studentCard-container">
                        {Students.map((s, index) => (
                            <StudentCard
                                key={index}
                                id={s.id}
                                name={s.name}
                                pic={s.profile_pic}
                                studentClass={s.studentClass}
                                picked_dropped_at={s.picked_dropped_at}
                            />
                        ))}
                    </div>
                </div>
                <SidePanel />
            </div>
        </div>
    )
}

function StudentCard(props) {
  const alt = props.id + ' image';
  return (
    <div className="student-card">
        <div className="student-profile-pic">
            <img className="card-image" src={props.pic} alt={alt}/>
        </div>
        <div className="student-info">
            <h2 className="studentCard-name">Tên: {props.name}</h2>
            <hr></hr>
            <p className="studentCard-id">Mã HS: {props.id}</p>
            <hr></hr>
            <p className="studentCard-class">Lớp: {props.studentClass}</p>
            <hr></hr>
            <p className="studentCard-picked_dropped_at">Đón/Thả tại: {props.picked_dropped_at}</p>
        </div>
    </div>
  )
}