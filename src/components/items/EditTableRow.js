import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { handleSave, renderInput } from "./ItemUtil";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";

export default function EditTableRow({ item, fields, onSave, onDelete, onEdit }) {
  const [formData, setFormData] = useState(item);
  const ref = useRef(null);

  const save = () => {
    handleSave("Row saved", formData, onSave);
  };

  const remove = () => {
    toast.success("Row deleted");
    onDelete(item.id);
  };

  return (
      <tr>
        {fields.filter((item)=>!item.advanced).map((field, index) => (
            <td key={index}>
              {renderInput(field, formData, setFormData, index === 0 ? ref : null)}
            </td>
        ))}
        <td>
          <button onClick={onEdit} className={"hoverable"}><FontAwesomeIcon icon={faEdit}/></button>
          <button onClick={remove} className={"hoverable delete"} style={{marginLeft: "10px"}}><FontAwesomeIcon icon={faTrash}/></button>
        </td>
      </tr>
  );
}
