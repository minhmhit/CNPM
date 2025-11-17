import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { getAllUsers, addNew, deleteItem, getAllRoutes, getAllBuses } from "./api/ManageList.api";
import "./Admin.css";
import { FiPlusCircle, FiSave, FiTrash2, FiArrowLeft, FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { getAllDrivers, getAllStudents } from "./api/ManageList.api";

export default function ManageList({ onBack }) {
    const [category, setCategory] = useState("routes");
    const [data, setData] = useState({
        students: [],
        drivers: [],
        buses: [],
        routes: [],
    });

    const [newItem, setNewItem] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [detailItem, setDetailItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const handleViewDetail = async (item) => {
    try {
        let fullItem = item;
        if (category === "drivers") {
            const drivers = await getAllDrivers();
            fullItem = drivers.find(d => d.userid === item.userid) || item;
        } else if (category === "students") {
            const students = await getAllStudents();
            fullItem = students.find(s => s.userid === item.userid) || item;
        }
        setDetailItem(fullItem);
        setShowDetail(true);
    } catch (err) {
        console.error("❌ Lỗi tải chi tiết:", err);
        toast.error("Không thể tải chi tiết!", { position: "top-center" });
    }
};

    // Fetch dữ liệu theo danh mục
    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getAllUsers();
                // Lọc theo danh mục
                let filteredData = [];
                if (category === "drivers") {
                    filteredData = users.filter(
                        (u) => u.role === "driver" && u.isActive === 1
                    );
                } else if (category === "students") {
                    filteredData = users.filter(
                        (u) => u.role === "student" && u.isActive === 1
                    );
                } else if (category === "routes") {
                    const routeRes = await getAllRoutes();
                    filteredData = routeRes.data.data || routeRes.data;
                } else if (category === "buses") {
                    const busRes = await getAllBuses();
                    filteredData = busRes.data.data || busRes.data;
                }
                setData((prev) => ({ ...prev, [category]: filteredData }));
            } catch (err) {
                console.error("❌ Lỗi tải dữ liệu:", err);
                toast.error("Lỗi: Không thể tải dữ liệu!", { toastId: 'fetch-error' });
            }
        };
        fetchData();
    }, [category]);


    // Thêm mới
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            let url = "";
            let payload = {};

            switch (category) {
                case "routes":
                    url = `/route/add`;
                    payload = newItem;
                    break;
                case "buses":
                    url = `/bus/add`;
                    payload = newItem;
                    break;
                case "drivers":
                    url = `/user/register`;
                    payload = {
                        username: newItem.username,
                        password: newItem.password,
                        email: newItem.email,
                        role: "driver",
                    };
                    break;
                case "students":
                    url = `/user/register`;
                    payload = {
                        username: newItem.username,
                        password: newItem.password,
                        email: newItem.email,
                        role: "student",
                    };
                    break;
                default:
                    return;
            }

            const res = await addNew(url, payload);
            toast.success("Thêm mới thành công!", { position: "top-center" });
            setShowForm(false);
            setNewItem({});

            // Reload danh sách
            const updatedRes = await getAllUsers();
            const users = updatedRes.data.data || updatedRes.data;
            if (category === "drivers") {
                setData((prev) => ({
                    ...prev,
                    drivers: users.filter((u) => u.role === "driver" && u.isActive === 1),
                }));
            } else if (category === "students") {
                setData((prev) => ({
                    ...prev,
                    students: users.filter((u) => u.role === "student" && u.isActive === 1),
                }));
            } else {
                // Với bus và route thì thêm trực tiếp vào danh sách cũ
                setData((prev) => ({
                    ...prev,
                    [category]: [...prev[category], res.data],
                }));
            }
        } catch (err) {
            //     console.error("Lỗi khi thêm:", err);
            //     toast.error("❌ Lỗi: Không thể thêm dữ liệu!", { position: "top-center" });
        }
    };

    // Xóa
    const handleDelete = async (id) => {
        // Hiện tại dùng window.confirm để giữ nguyên luồng logic
        if (!window.confirm(`Bạn có chắc muốn xóa ${category} ID ${id} không? (Chuyển thành Inactive)`)) return;

        try {
            let url = "";
            switch (category) {
                case "routes":
                    url = `${API_BASE}/route/delete/${id}`;
                    break;
                case "buses":
                    url = `${API_BASE}/bus/delete/${id}`;
                    break;
                case "drivers":
                    url = `${API_BASE}/user/delete/${id}`;
                    break;
                case "students":
                    url = `${API_BASE}/user/delete/${id}`;
                    break;
                default:
                    return;
            }

            const res = await deleteItem(url);

            if (res.status === 200) {
                // Cập nhật lại danh sách bằng cách loại bỏ item đã xóa (hoặc chuyển thành inactive)
                const updatedList = data[category].filter(item => {
                    const itemId = item.userid || item.route_id || item.bus_id || item.id;
                    return itemId.toString() !== id.toString();
                });

                setData((prev) => ({
                    ...prev,
                    [category]: updatedList,
                }));

                if (category === "drivers" || category === "students") {
                    toast.info(`Thông báo: Đã cập nhật trạng thái của ${category} ID ${id} thành Ngưng hoạt động.`, { position: "top-center" });
                } else {
                    toast.success(`Đã xóa ${category} ID ${id} thành công!`, { position: "top-center" });
                }
            }
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            toast.error(`Lỗi: Không thể xóa ${category} ID ${id}!`, { position: "top-center" });
        }
    };

    // Render form input
    const renderInputFields = () => {
        switch (category) {
            case "routes":
                return (
                    <>
                        <label>Tên tuyến:</label>
                        <input
                            value={newItem.route_name || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, route_name: e.target.value })
                            }
                            placeholder="Nhập tên tuyến"
                        />
                        <label>Mô tả:</label>
                        <input
                            value={newItem.description || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, description: e.target.value })
                            }
                            placeholder="Nhập mô tả"
                        />
                    </>
                );
            case "buses":
                return (
                    <>
                        <label>Biển số:</label>
                        <input
                            value={newItem.license_plate || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, license_plate: e.target.value })
                            }
                            placeholder="Nhập biển số"
                        />
                        <label>Model:</label>
                        <input
                            value={newItem.model || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, model: e.target.value })
                            }
                            placeholder="Nhập model xe"
                        />
                        <label>Sức chứa:</label>
                        <input
                            type="number"
                            value={newItem.capacity || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, capacity: e.target.value })
                            }
                            placeholder="Nhập sức chứa"
                        />
                    </>
                );
            case "drivers":
            case "students":
                return (
                    <>
                        <label>Họ và tên:</label>
                        <input
                            value={newItem.username || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, username: e.target.value })
                            }
                            placeholder="Nhập họ và tên"
                        />
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            value={newItem.password || ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, password: e.target.value })
                            }
                            placeholder="Nhập mật khẩu"
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={newItem.email || ""}
                            onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                            placeholder="Nhập email"
                        />
                    </>
                );
            default:
                return null;
        }
    };

    // Render bảng
    const list = data[category] || [];
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = list.slice(startIdx, startIdx + itemsPerPage);

    const renderTableHeader = () => {
        switch (category) {
            case "routes":
                return (
                    <tr>
                        <th>ID</th>
                        <th>Tên tuyến</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                );
            case "buses":
                return (
                    <tr>
                        <th>ID</th>
                        <th>Biển số</th>
                        <th>Model</th>
                        <th>Sức chứa</th>
                        <th>Hành động</th>
                    </tr>
                );
            case "drivers":
                return (
                    <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                );
            case "students":
                return (
                    <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                );


            default:
                return null;
        }
    };

    const renderTableRows = () => {
        switch (category) {
            case "routes":
                return currentItems.map((r) => (
                    <tr key={r.route_id || r.id}>
                        <td>{r.route_id || r.id}</td>
                        <td>{r.route_name || r.name || "Không có tên"}</td>
                        <td>{r.description || r.detail || "—"}</td>
                        <td>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(r.route_id || r.id)}
                            >
                                <FiTrash2 size={17} style={{ marginRight: 4 }} />
                                Xóa
                            </button>

                        </td>
                    </tr>
                ));
            case "buses":
                return currentItems.map((b) => (
                    <tr key={b.bus_id || b.id}>
                        <td>{b.bus_id || b.id}</td>
                        <td>{b.license_plate}</td>
                        <td>{b.model}</td>
                        <td>{b.capacity}</td>
                        <td>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(b.bus_id || b.id)}
                            >
                                <FiTrash2 size={17} style={{ marginRight: 4 }} />
                                Xóa
                            </button>
                        </td>
                    </tr>
                ));
            case "drivers":
                return currentItems.map((d) => (
                    <tr key={d.userid}>
                        <td>{d.userid}</td>
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td style={{ color: d.isActive ? "green" : "red", fontWeight: "bold" }}>
                            {d.isActive ? "Hoạt động" : "Ngưng"}
                        </td>
                        <td>
                            <button
                                className="detail-btn"
                                onClick={() => handleViewDetail(d)}
                            >
                                <FiSend size={17} style={{ marginRight: 4 }} />
                                Chi tiết
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(d.userid)}
                            >
                                <FiTrash2 size={17} style={{ marginRight: 4 }} />
                                Xóa
                            </button>
                        </td>
                    </tr>
                ));


            case "students":
                return currentItems.map((s) => (
                    <tr key={s.userid}>
                        <td>{s.userid}</td>
                        <td>{s.username}</td>
                        <td>{s.email}</td>
                        <td style={{ color: s.isActive ? "green" : "red", fontWeight: "bold" }}>
                            {s.isActive ? "Hoạt động" : "Ngưng"}
                        </td>
                        <td>
                            <button
                                className="detail-btn"
                                onClick={() => handleViewDetail(s)}
                            >
                                <FiSend size={17} style={{ marginRight: 4 }} />
                                Chi tiết
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(s.userid)}
                            >
                                <FiTrash2 size={17} style={{ marginRight: 4 }} />
                                Xóa
                            </button>
                        </td>
                    </tr>
                ));



            default:
                return null;
        }
    };

    return (
        <div className="manage-list-container">
            <h3>Quản lý danh sách</h3>

            <div className="category-select">
                <label>Chọn danh mục: </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="routes">Tuyến đường</option>
                    <option value="buses">Xe buýt</option>
                    <option value="drivers">Tài xế</option>
                    <option value="students">Học sinh</option>
                </select>
            </div>

            <table className="list-table">
                <thead>{renderTableHeader()}</thead>
                <tbody>{renderTableRows()}</tbody>
            </table>

            {/* Phân trang */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    -
                </button>
                <span>
                    Trang {currentPage}/{totalPages || 1}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    +
                </button>
            </div>

            <button className="add-btn" onClick={() => setShowForm(true)}>
                <FiPlusCircle size={18} style={{ marginRight: 6 }} />
                Thêm mới
            </button>

            {showForm && (
                <div className="overlay">
                    <div className="popup-form">
                        <h3>
                            Thêm{" "}
                            {category === "drivers"
                                ? "tài xế"
                                : category === "students"
                                    ? "học sinh"
                                    : category}
                        </h3>
                        <form onSubmit={handleAdd}>
                            {renderInputFields()}
                            <div className="form-buttons">
                                <button type="submit" className="add-btn">
                                    <FiSave size={18} style={{ marginRight: 6 }} />
                                    Lưu
                                </button>

                                <button
                                    type="button"
                                    className="cancel-form-btn"
                                    onClick={() => setShowForm(false)}
                                >
                                    <MdCancel size={18} style={{ marginRight: 6 }} />
                                    Hủy
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
            {showDetail && detailItem && (
                <div className="overlay">
                    <div className="popup-form">
                        <h3>Thông tin chi tiết</h3>

                        {category === "students" ? (
                            <>
                                <p><strong>ID:</strong> {detailItem.student_id || detailItem.userid}</p>
                                <p><strong>Tên:</strong> {detailItem.name || detailItem.username}</p>
                                <p><strong>Lớp:</strong> {detailItem.className || "—"}</p>
                                <p><strong>Email:</strong> {detailItem.email}</p>
                                <p><strong>Điểm đón:</strong> {detailItem.pickup_name || "—"}</p>
                                <p><strong>Điểm trả:</strong> {detailItem.dropoff_name || "—"}</p>
                            </>
                        ) : category === "drivers" ? (
                            <>
                                <p><strong>ID:</strong> {detailItem.driver_id || detailItem.userid}</p>
                                <p><strong>Tên:</strong> {detailItem.name || detailItem.username}</p>
                                <p><strong>Số điện thoại:</strong> {detailItem.phone_number || "—"}</p>
                                <p><strong>Email:</strong> {detailItem.email}</p>
                            </>
                        ) : null}

                        <button
                            className="cancel-form-btn"
                            onClick={() => setShowDetail(false)}
                            style={{ marginTop: 10 }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            <button onClick={onBack} className="cancel-btn" style={{ marginTop: 15 }}>
                <FiArrowLeft size={18} style={{ marginRight: 6 }} />
                Quay lại
            </button>

        </div>
    );
}