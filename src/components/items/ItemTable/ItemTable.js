import React, { useEffect, useState } from "react";
import EditTableRow from "../EditTableRow";
import styles from "./ItemTable.module.css";
import SearchBar from "../../SearchBar/SearchBar";
import FloatingButton from "../../FloatingButton/FloatingButton";
import { useStack } from "../../../StackContext";
import ItemForm from "../ItemForm/ItemForm";
import { getNestedValue, renderValue, renderLabel } from "../ItemUtil";

export default function ItemTable({
                                    fields,
                                    data,
                                    onSave,
                                    onDelete,
                                    onAdd,
                                    page,
                                    setPage,
                                    limit,
                                    setLimit,
                                  }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [multi, setMulti] = useState([]);
  const { push } = useStack();
  const [filteredData, setFilteredData] = useState(data);
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  const mobileFields = fields.filter((field) => field.mobile).sort((a, b) => a.mobile - b.mobile);

  const editInMobile = (item) => {
    push({
      page: (
          <ItemForm
              initialData={item}
              fields={fields}
              onSubmit={onSave}
              isEditMode={true}
              onDelete={onDelete}
          />
      ),
      title: "Redigera",
    });
  };

  const goToAdd = () => {
    push({
      page: (
          <ItemForm
              fields={fields}
              onSubmit={onAdd}
              isEditMode={false}
          />
      ),
      title: "Lägg Till Ny",
    });
  };

    const search = (query) => {
        if (query.length > 1) {
            setFilteredData(() =>
                data.filter((item) =>
                    fields
                        .filter((field) => !field.advanced) // Only non-advanced fields
                        .some((field) => {
                            const value = renderValue(field, getNestedValue(item, field.key)); // Use getNestedValue to fetch the field's value
                            return (
                                value &&
                                value.toString().toLowerCase().includes(query.toLowerCase()) // Check if it matches the query
                            );
                        })
                )
            );
        } else {
            setFilteredData(data); // Reset to full data if query is too short
        }
    };


    const changePage = (change = inputPage) => {
        if(Number(limit) !== 10000){
            if (change === "+") {
                setPage((prev) => prev + 1);
            } else if (change === "-" && page > 1) {
                setPage((prev) => prev - 1);
            } else if (change > 0) {
                setPage(change);
            }
        }else{
            setPage(1)
        }

  };

  return (
      <>
        <div style={{display: "flex", padding: "10px", justifyContent: "space-between"}}>
          <button className="hoverable desktop" onClick={goToAdd}>Skapa ny</button>
          <FloatingButton className="mobile" text="Lägg till Ny" onClick={goToAdd}/>
          <SearchBar onSearch={search}/>
        </div>
          {page && limit && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center" }}>
                  {/* Page Size Selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <label style={{ fontWeight: "bold" }}>Antal per sida: </label>
                      <select
                          value={limit}
                          onChange={(e) => {
                              if(Number(e.target.value ) === 10000)setPage(1)
                              setLimit(e.target.value)
                          }
                      }
                          style={{
                              padding: "5px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                          }}
                      >
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={500}>500</option>
                          <option value={1000}>1000</option>
                          <option value={10000}>Alla</option>
                      </select>
                  </div>

                  {/* Page Navigator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <button
                          onClick={() => changePage('-')}
                          style={{
                              padding: "5px 10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              cursor: "pointer",
                          }}
                      >
                          &lt;
                      </button>
                      <input
                          type="number"
                          value={inputPage}
                          readOnly
                          style={{
                              width: "40px",
                              textAlign: "center",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                              padding: "5px",
                          }}
                      />
                      <button
                          onClick={() => changePage('+')}
                          style={{
                              padding: "5px 10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              cursor: "pointer",
                          }}
                      >
                          &gt;
                      </button>
                  </div>
              </div>
          )}

        <table className={`${styles.table} desktop`} cellPadding="10" cellSpacing="0">
          <thead>
          <tr>
            {fields.map(
                (field, index) =>
                    !field.advanced && (
                        <th key={index} className={styles.th}>
                          {renderLabel(field)}
                        </th>
                    )
            )}
            <th style={{width: "100px"}}></th>
          </tr>
          </thead>
          <tbody>
          {filteredData === null ? (
              <tr>
                <td
                    colSpan={fields.filter((field) => !field.advanced).length + 1}
                    style={{textAlign: "center", padding: "20px"}}
                >
                  Loading...
                </td>
              </tr>
          ) : (
              filteredData.map((item, index) =>
                  index === selectedRow ? (
                      <EditTableRow
                          key={index}
                          item={item}
                          fields={fields}
                          onSave={(updatedItem) => {
                            onSave(updatedItem);
                            setSelectedRow(null);
                          }}
                          onDelete={(id) => {
                            onDelete(id);
                            setSelectedRow(null);
                          }}
                          onEdit={() => editInMobile(item)}
                      />
                  ) : (
                      <tr
                          key={index}
                          onDoubleClick={() => setSelectedRow(index)}
                          className={index % 2 === 0 ? "" : styles.oddRow}
                      >
                        {fields.map(
                            (field, fieldIndex) =>
                                !field.advanced && (
                                    <td key={fieldIndex} className={styles.td}>
                                      {renderValue(field, getNestedValue(item, field.key))}
                                    </td>
                                )
                        )}
                        <td>
                          <input
                              type="checkbox"
                              onChange={(e) => {
                                e.target.checked
                                    ? setMulti((prev) => [...prev, index])
                                    : setMulti((prev) => prev.filter((idx) => idx !== index));
                              }}
                          />
                        </td>
                      </tr>
                  )
              )
          )}
          </tbody>
        </table>
        <div className="mobile">
          {filteredData &&
              filteredData.map((item, itemIndex) => (
                  <div
                      key={itemIndex}
                      className={`${styles.mobileItem} block`}
                      onClick={() => editInMobile(item)}
                  >
                    {/* Render the fields in two columns */}
                    <div className={styles.mobileColumn}>
                      {/* First Column: Fields with mobile priority 1, 2, 3 */}
                      {mobileFields
                          .filter((field) => field.mobile <= 3)
                          .map((field) => (
                              <div key={field.key}>
                                {field.mobile === 1 && (
                                    <h3>{renderValue(field, getNestedValue(item, field.key))}</h3>
                                )}
                                {field.mobile === 2 && (
                                    <h4 style={{color: "var(--darkAccent)"}}>
                                      {renderValue(field, getNestedValue(item, field.key))}
                                    </h4>
                                )}
                                {field.mobile === 3 && (
                                    <h5>{renderValue(field, getNestedValue(item, field.key))}</h5>
                                )}
                              </div>
                          ))}
                    </div>
                    <div className={styles.mobileColumn}>
                      {/* Second Column: Fields with mobile priority 4, 5 */}
                      {mobileFields
                          .filter((field) => field.mobile > 3)
                          .map((field) => (
                              <div key={field.key}>
                                {field.mobile === 4 && (
                                    <h3>{renderValue(field, getNestedValue(item, field.key))}</h3>
                                )}
                                {field.mobile === 5 && (
                                    <h5>{renderValue(field, getNestedValue(item, field.key))}</h5>
                                )}
                              </div>
                          ))}
                    </div>
                  </div>
              ))}
        </div>


      </>
  );
}
