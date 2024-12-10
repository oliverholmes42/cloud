import React, { useEffect, useState } from "react";
import EditTableRow from "../EditTableRow";
import styles from "./ItemTable.module.css";
import SearchBar from "../../SearchBar/SearchBar";
import FloatingButton from "../../FloatingButton/FloatingButton";
import { useStack } from "../../../StackContext";
import ItemForm from "../ItemForm/ItemForm";
import { getNestedValue, renderValue, renderLabel } from "../ItemUtil";
import Modal from "../../Modal/Modal";

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
                                    customFunction,
                                    date,
                                    canEdit = true,
                                      canRemove= true,
                                  }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [multi, setMulti] = useState([]);
  const { push } = useStack();
  const [filteredData, setFilteredData] = useState(data);
  const [inputPage, setInputPage] = useState(page);
  const [filterSearch, setFilterSearch] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  const mobileFields = fields.filter((field) => field.mobile).sort((a, b) => a.mobile - b.mobile);

  const editInMobile = (item) => {
      if(!canEdit)return
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

    const doFilterSearch = () => {
        console.log("Starting doFilterSearch with:", { filterSearch, filterValue });

        if (!filterSearch || (!filterValue.f && !filterValue.t)) {
            console.log("Invalid filterSearch or filterValue. Resetting data.");
            setFilteredData(data);
            return;
        }

        setFilteredData(() =>
            data.filter((item, index) => {
                const field = filterSearch;
                if (!field) {
                    console.error(`Field with key "${filterSearch}" not found.`);
                    return false;
                }

                let rawValue = getNestedValue(item, field.key);
                console.log(`Item ${index}: rawValue =`, rawValue);

                if (rawValue === null || rawValue === undefined) return false;

                let fromValue = filterValue.f?.trim() || null;
                let toValue = filterValue.t?.trim() || null;

                // Handle specific data types based on field format
                if (field.format?.type === "currency") {
                    fromValue = fromValue ? Number(Number(fromValue).fromCurrency()) : null;
                    toValue = toValue ? Number(Number(toValue).fromCurrency()) : null;
                } else if (field.format?.type === "number") {
                    fromValue = fromValue ? Number(fromValue) : null;
                    toValue = toValue ? Number(toValue) : null;
                } else if (field.format?.type === "date") {
                    fromValue = fromValue ? new Date(fromValue).getTime() : null;
                    toValue = toValue ? new Date(toValue).getTime() : null;
                    rawValue = new Date(rawValue).getTime();
                } else {
                    // Default to string comparison for text or untyped fields
                    fromValue = fromValue?.toString().toLowerCase() || null;
                    toValue = toValue?.toString().toLowerCase() || null;
                    rawValue = rawValue.toString().toLowerCase();
                }



                // Check range or inclusion
                if (fromValue !== null && toValue !== null) {
                    return rawValue >= fromValue && rawValue <= toValue;
                } else if (fromValue !== null) {
                    return rawValue.includes(fromValue);
                } else if (toValue !== null) {
                    return rawValue.includes(toValue);
                }

                return false;
            })
        );

        console.log("doFilterSearch complete.");
    };






    const DateSelect = () => {
        if(!date)return;
        return(
            <div>
                {date.from && <input type="date" value={date.from.value} onChange={(e) => date.from.set(e.target.value)} />}
                {date.to && <input type="date" value={date.to.value} onChange={(e) => date.to.set(e.target.value)} />}
                {date.apply && <button onClick={date.apply}>Apply</button>}
            </div>
        )
    }


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
          <DateSelect/>
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
                          {renderLabel(field, setFilterSearch, setFilterValue)}
                        </th>
                    )
            )}
            <th style={{width: "180px"}}></th>
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
                          customFunction={customFunction}
                          edit={canEdit}
                          canRemove={canRemove}
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
                                      {
                                          renderValue(field, getNestedValue(item, field.key))
                                      }
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
          {
              filterSearch && (
                  <Modal closeModal={() => setFilterSearch(null)}>
                      {filterValue?.f && (
                          <div>
                              <label htmlFor="filter-from">Från:</label>
                              <input
                                  id="filter-from"
                                  onChange={(e) => setFilterValue({ ...filterValue, f: e.target.value })}
                                  value={filterValue.f}
                              />
                          </div>
                      )}
                      {filterValue?.t && (
                          <div>
                              <label htmlFor="filter-to">Till:</label>
                              <input
                                  id="filter-to"
                                  onChange={(e) => setFilterValue({ ...filterValue, t: e.target.value })}
                                  value={filterValue.t}
                              />
                          </div>
                      )}
                      <button
                          onClick={() => {
                              console.log(filterValue);
                              setFilterSearch(null);
                              doFilterSearch()
                          }}
                      >
                          Sök
                      </button>
                  </Modal>
              )
          }


      </>
  );
}
