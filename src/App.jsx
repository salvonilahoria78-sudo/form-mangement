import { useState } from "react";
import "./App.css";

const emptyForm = {
firstName: "",
lastName: "",
email: "",
phone: "",
country: "",
dateOfBirth: "",
gender: "",
experience: "",
skills: "",
address: "",
hobbies: [],
notifications: false,
about: "",
};

const hobbiesList = ["Reading", "Music", "Sports", "Traveling"];
const skillsList = ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"];

function App() {
const [formData, setFormData] = useState({ ...emptyForm });
const [errors, setErrors] = useState({});
const [records, setRecords] = useState(() => {
try {
return JSON.parse(localStorage.getItem("formRecords")) || [];
} catch {
return [];
}
});
const [editingId, setEditingId] = useState(null);

const handleChange = (e) => {
const { name, value, checked, type } = e.target;

setFormData({
  ...formData,
  [name]: type === "checkbox" ? checked : value,
});

setErrors({ ...errors, [name]: "" });

};

const validateForm = () => {
const newErrors = {};

if (!formData.firstName.trim()) {
  newErrors.firstName = "First name is required";
}

if (!formData.lastName.trim()) {
  newErrors.lastName = "Last name is required";
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  newErrors.email = "Enter a valid email address";
}

if (!/^\d{10}$/.test(formData.phone.trim())) {
  newErrors.phone = "Enter a 10-digit phone number";
}

if (!formData.country) {
  newErrors.country = "Please select a country";
}

if (!formData.dateOfBirth) {
  newErrors.dateOfBirth = "Date of birth is required";
} else if (
  formData.dateOfBirth > new Date().toISOString().slice(0, 10)
) {
  newErrors.dateOfBirth = "Date cannot be in the future";
}

if (!formData.gender) {
  newErrors.gender = "Please select your gender";
}

if (formData.experience !== "" && Number(formData.experience) < 0) {
  newErrors.experience = "Experience cannot be negative";
}

setErrors(newErrors);
return Object.keys(newErrors).length === 0;

};

const saveRecords = (updatedRecords) => {
localStorage.setItem("formRecords", JSON.stringify(updatedRecords));
setRecords(updatedRecords);
};

const handleSubmit = (e) => {
e.preventDefault();

if (!validateForm()) return;

let updatedRecords;

if (editingId !== null) {
  updatedRecords = records.map((record) =>
    record.id === editingId ? { ...formData, id: editingId } : record
  );
} else {
  updatedRecords = [...records, { ...formData, id: Date.now() }];
}

saveRecords(updatedRecords);
alert(editingId !== null ? "Record updated successfully!" : "Record saved successfully!");
handleReset();


};

const handleReset = () => {
setFormData({ ...emptyForm });
setErrors({});
setEditingId(null);
};

const handleEdit = (record) => {
setFormData({ ...emptyForm, ...record });
setEditingId(record.id);
setErrors({});
window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleDelete = (id) => {
if (!window.confirm("Do you want to delete this record?")) return;


saveRecords(records.filter((record) => record.id !== id));

if (editingId === id) {
  handleReset();
}
};

const handleHobby = (e) => {
const { value, checked } = e.target;

const hobbies = checked
  ? [...formData.hobbies, value]
  : formData.hobbies.filter((hobby) => hobby !== value);

setFormData({ ...formData, hobbies });

};

const wordCount = formData.about.trim()
? formData.about.trim().split(/\s+/).length
: 0;

return ( <div className="app"> <h1>Form Management System</h1>


  <form onSubmit={handleSubmit} noValidate>
    <h2>Personal Information</h2>

    <div className="form-row">
      <div className="form-group">
        <label>First Name *</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" />
        <p className="error-message">{errors.firstName}</p>
      </div>

      <div className="form-group">
        <label>Last Name *</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
        <p className="error-message">{errors.lastName}</p>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Email Address *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
        <p className="error-message">{errors.email}</p>
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input type="tel" name="phone" maxLength="10" value={formData.phone} onChange={handleChange} placeholder="10-digit phone number" />
        <p className="error-message">{errors.phone}</p>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Date of Birth *</label>
        <input type="date" name="dateOfBirth" max={new Date().toISOString().slice(0, 10)} value={formData.dateOfBirth} onChange={handleChange} />
        <p className="error-message">{errors.dateOfBirth}</p>
      </div>

      <div className="form-group">
        <label>Country *</label>
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="">Select country</option>
          <option value="India">India</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
        <p className="error-message">{errors.country}</p>
      </div>
    </div>

    <div className="form-group">
      <label>Gender *</label>
      <div className="options">
        {["Male", "Female", "Other"].map((gender) => (
          <label key={gender}>
            <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={handleChange} />
            {gender}
          </label>
        ))}
      </div>
      <p className="error-message">{errors.gender}</p>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Experience (Years)</label>
        <input type="number" name="experience" min="0" value={formData.experience} onChange={handleChange} placeholder="Enter experience" />
        <p className="error-message">{errors.experience}</p>
      </div>

      <div className="form-group">
        <label>Skills</label>
        <select name="skills" value={formData.skills} onChange={handleChange}>
          <option value="">Select a skill</option>
          {skillsList.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>Address</label>
      <textarea name="address" rows="3" value={formData.address} onChange={handleChange} placeholder="Enter address" />
    </div>

    <div className="form-group">
      <label>Hobbies</label>
      <div className="options">
        {hobbiesList.map((hobby) => (
          <label key={hobby}>
            <input type="checkbox" value={hobby} checked={formData.hobbies.includes(hobby)} onChange={handleHobby} />
            {hobby}
          </label>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>
        <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} />
        {" "}Enable notifications
      </label>
    </div>

    <div className="form-group">
      <label>About Yourself (Maximum 50 words)</label>
      <textarea
        name="about"
        rows="4"
        value={formData.about}
        onChange={(e) => {
          const text = e.target.value;
          if (text.trim().split(/\s+/).filter(Boolean).length <= 50) {
            setFormData({ ...formData, about: text });
          }
        }}
        placeholder="Tell us about yourself"
      />
      <small>{wordCount}/50 words</small>
    </div>

    <div className="button-group">
      <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
      <button type="submit" className="submit-btn">
        {editingId !== null ? "Update Record" : "Submit"}
      </button>
    </div>
  </form>

  <div className="records-container">
    <h2>Saved Records ({records.length})</h2>

    {records.length === 0 ? (
      <p>No records found. Please submit the form.</p>
    ) : (
      records.map((record) => (
        <div className="record-card" key={record.id}>
          <h3>{record.firstName} {record.lastName}</h3>
          <p><strong>Email:</strong> {record.email}</p>
          <p><strong>Phone:</strong> {record.phone}</p>
          <p><strong>Country:</strong> {record.country}</p>
          <p><strong>Date of Birth:</strong> {record.dateOfBirth}</p>
          <p><strong>Gender:</strong> {record.gender}</p>
          <p><strong>Experience:</strong> {record.experience || "Not provided"}</p>
          <p><strong>Skills:</strong> {record.skills || "None selected"}</p>
          <p><strong>Address:</strong> {record.address || "Not provided"}</p>
          <p><strong>Hobbies:</strong> {record.hobbies.join(", ") || "None selected"}</p>
          <p><strong>Notifications:</strong> {record.notifications ? "Enabled" : "Disabled"}</p>
          <p><strong>About:</strong> {record.about || "Not provided"}</p>

          <div className="record-actions">
            <button type="button" className="edit-btn" onClick={() => handleEdit(record)}>Edit</button>
            <button type="button" className="delete-btn" onClick={() => handleDelete(record.id)}>Delete</button>
          </div>
        </div>
      ))
    )}
  </div>
</div>


);
}

export default App;
