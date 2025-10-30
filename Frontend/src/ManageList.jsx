import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const API_BASE = "http://localhost:5000/api/v1";

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

  // Fetch dữ liệu theo danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${API_BASE}/admin/getAllUsers`;
        const res = await axios.get(url);
        const users = res.data.data || res.data;

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
          const routeRes = await axios.get(`${API_BASE}/route/getAllRoutes`);
          filteredData = routeRes.data.data || routeRes.data;
        } else if (category === "buses") {
          const busRes = await axios.get(`${API_BASE}/bus/`);
          filteredData = busRes.data.data || busRes.data;
        }

        setData((prev) => ({ ...prev, [category]: filteredData }));
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
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
        url = `${API_BASE}/route/add`;
        payload = newItem;
        break;
      case "buses":
        url = `${API_BASE}/bus/add`;
        payload = newItem;
        break;
      case "drivers":
        url = `${API_BASE}/user/register`;
        payload = {
          username: newItem.username,
          password: newItem.password,
          email: newItem.email,
          role: "driver",
        };
        break;
      case "students":
        url = `${API_BASE}/user/register`;
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

    const res = await axios.post(url, payload);
    alert("Thêm mới thành công!");
    setShowForm(false);
    setNewItem({});

    // Reload danh sách
    const updatedRes = await axios.get(`${API_BASE}/admin/getAllUsers`);
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
    console.error("Lỗi khi thêm:", err);
    alert("Không thể thêm dữ liệu!");
  }
};

  // Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

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

      const res = await axios.delete(url);

      if (res.status === 200) {
        setData((prev) => ({
          ...prev,
          [category]: prev[category].filter(
            (item) => item.userid !== id
          ),
        }));
        alert("Đã cập nhật trạng thái thành inActive!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa!");
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
          <label>Tên đăng nhập:</label>
          <input
            value={newItem.username || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, username: e.target.value })
            }
            placeholder="Nhập tên đăng nhập"
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
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        );
      case "students":
        return (
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
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
                className="delete-btn"
                onClick={() => handleDelete(d.userid)}
              >
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
                className="delete-btn"
                onClick={() => handleDelete(s.userid)}
              >
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
        + Thêm mới
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
                  Lưu
                </button>
                <button
                  type="button"
                  className="cancel-form-btn"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button onClick={onBack} className="cancel-btn" style={{ marginTop: 15 }}>
        Quay lại
      </button>
    </div>
  );
}
