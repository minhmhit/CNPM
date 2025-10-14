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

  // 🧭 Fetch dữ liệu theo danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        switch (category) {
          case "routes":
            url = `${API_BASE}/route/`;
            break;
          case "buses":
            url = `${API_BASE}/bus/`;
            break;
          case "drivers":
            url = `${API_BASE}/driver/`;
            break;
          case "students":
            url = `${API_BASE}/student/`;
            break;
          default:
            return;
        }
        const res = await axios.get(url);
        setData((prev) => ({ ...prev, [category]: res.data }));
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, [category]);

  // ➕ Thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let url = "";
      switch (category) {
        case "routes":
          url = `${API_BASE}/route/add`;
          break;
        case "buses":
          url = `${API_BASE}/bus/add`;
          break;
        case "drivers":
          url = `${API_BASE}/driver/add`;
          break;
        case "students":
          url = `${API_BASE}/student/add`;
          break;
        default:
          return;
      }

      const res = await axios.post(url, newItem);
      setData((prev) => ({
        ...prev,
        [category]: [...prev[category], res.data],
      }));
      setShowForm(false);
      setNewItem({});
    } catch (err) {
      console.error("❌ Lỗi khi thêm:", err);
      alert("Không thể thêm dữ liệu!");
    }
  };

  // ❌ Xóa
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
          url = `${API_BASE}/driver/delete/${id}`;
          break;
        case "students":
          url = `${API_BASE}/student/delete/${id}`;
          break;
        default:
          return;
      }
      await axios.delete(url);
      setData((prev) => ({
        ...prev,
        [category]: prev[category].filter(
          (item) =>
            item.id !== id &&
            item.route_id !== id &&
            item.bus_id !== id &&
            item.driver_id !== id &&
            item.student_id !== id
        ),
      }));
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
    }
  };

  // 🎨 Render form input
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
              placeholder="VD: Tuyến 01 - SGU"
            />
            <label>Mô tả:</label>
            <input
              value={newItem.description || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              placeholder="VD: Từ Q1 đến SGU"
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
              placeholder="VD: 36A-36363"
            />
            <label>Model:</label>
            <input
              value={newItem.model || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, model: e.target.value })
              }
            />
            <label>Sức chứa:</label>
            <input
              type="number"
              value={newItem.capacity || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, capacity: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  // 📋 Render bảng
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
      default:
        return null;
    }
  };

  return (
    <div className="manage-list-container">
      <h3>Quản lý danh sách</h3>
      <div className="category-select">
        <label>Chọn danh mục: </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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
            <h3>🚌 Thêm {category === "drivers" ? "tài xế" : category === "students" ? "học sinh" : category}</h3>
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
