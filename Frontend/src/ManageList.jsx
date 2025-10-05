import { useState } from "react";
import "./Admin.css";

export default function ManageList({ onBack }) {
  const [category, setCategory] = useState("students");

  const [data, setData] = useState({
    students: [
      { id: 1, name: "Hoai Nam", class: "5A" },
      { id: 2, name: "Neo Bam", class: "4B" },
      { id: 3, name: "Hoai Nam", class: "5A" },
      { id: 4, name: "Neo Bam", class: "4B" },
      { id: 5, name: "Hoai Nam", class: "5A" },
      { id: 6, name: "Neo Bam", class: "4B" },
      { id: 7, name: "Hoai Nam", class: "5A" },
      { id: 8, name: "Neo Bam", class: "4B" },
      { id: 9, name: "Hoai Nam", class: "5A" },
      { id: 10, name: "Neo Bam", class: "4B" },
      { id: 11, name: "Hoai Nam", class: "5A" },
      { id: 12, name: "Neo Bam", class: "4B" },
      { id: 13, name: "Hoai Nam", class: "5A" },
      { id: 14, name: "Neo Bam", class: "4B" },
    ],
    drivers: [
      { id: 1, name: "Nguyen Duc Minh", license: "B2" },
      { id: 2, name: "Mai Hoang Minh", license: "C" },
    ],
    buses: [
      { id: 1, plate: "36A-36363", capacity: 40 },
      { id: 2, plate: "18B-18181", capacity: 30 },
    ],
    routes: [
      { id: 1, name: "Tuyến 1", start: "Q1", end: "SGU" },
      { id: 2, name: "Tuyến 2", start: "Q2", end: "SGU" },
    ],
  });

  const [newItem, setNewItem] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
    setNewItem({});
    setCurrentPage(1); // reset trang khi đổi danh mục
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Date.now();
    setData((prev) => ({
      ...prev,
      [category]: [...prev[category], { id: newId, ...newItem }],
    }));
    setNewItem({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      setData((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item.id !== id),
      }));
    }
  };

  // Input fields
  const renderInputFields = () => {
    switch (category) {
      case "students":
        return (
          <>
            <input
              placeholder="Họ tên học sinh"
              value={newItem.name || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              placeholder="Lớp"
              value={newItem.class || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, class: e.target.value })
              }
            />
          </>
        );
      case "drivers":
        return (
          <>
            <input
              placeholder="Tên tài xế"
              value={newItem.name || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              placeholder="Bằng lái"
              value={newItem.license || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, license: e.target.value })
              }
            />
          </>
        );
      case "buses":
        return (
          <>
            <input
              placeholder="Biển số xe"
              value={newItem.plate || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, plate: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Sức chứa"
              value={newItem.capacity || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, capacity: e.target.value })
              }
            />
          </>
        );
      case "routes":
        return (
          <>
            <input
              placeholder="Tên tuyến"
              value={newItem.name || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              placeholder="Điểm đầu"
              value={newItem.start || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, start: e.target.value })
              }
            />
            <input
              placeholder="Điểm cuối"
              value={newItem.end || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, end: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  // Pagination
  const list = data[category];
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIdx, startIdx + itemsPerPage);

  // Table rendering
  const renderTableRows = () => {
    switch (category) {
      case "students":
        return currentItems.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.name}</td>
            <td>{s.class}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(s.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ));
      case "drivers":
        return currentItems.map((d) => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.name}</td>
            <td>{d.license}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(d.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ));
      case "buses":
        return currentItems.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.plate}</td>
            <td>{b.capacity}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(b.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ));
      case "routes":
        return currentItems.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.name}</td>
            <td>{r.start}</td>
            <td>{r.end}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(r.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ));
      default:
        return null;
    }
  };

  const renderTableHeader = () => {
    switch (category) {
      case "students":
        return (
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        );
      case "drivers":
        return (
          <tr>
            <th>ID</th>
            <th>Tên tài xế</th>
            <th>Bằng lái</th>
            <th>Hành động</th>
          </tr>
        );
      case "buses":
        return (
          <tr>
            <th>ID</th>
            <th>Biển số</th>
            <th>Sức chứa</th>
            <th>Hành động</th>
          </tr>
        );
      case "routes":
        return (
          <tr>
            <th>ID</th>
            <th>Tên tuyến</th>
            <th>Điểm đầu</th>
            <th>Điểm cuối</th>
            <th>Hành động</th>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <div className="manage-list-container">
      <h3>Quản lý danh sách</h3>
      <div className="category-select">
        <label>Chọn danh mục: </label>
        <select value={category} onChange={handleChangeCategory}>
          <option value="students">Học sinh</option>
          <option value="drivers">Tài xế</option>
          <option value="buses">Xe buýt</option>
          <option value="routes">Tuyến đường</option>
        </select>
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        {renderInputFields()}
        <button type="submit" className="add-btn">
          Thêm
        </button>
      </form>

      <table className="list-table">
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
        -
        </button>
        <span>
          Trang {currentPage}/{totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
        +
        </button>
      </div>

      <button onClick={onBack} className="cancel-btn" style={{ marginTop: 15 }}>
        Quay lại
      </button>
    </div>
  );
}
