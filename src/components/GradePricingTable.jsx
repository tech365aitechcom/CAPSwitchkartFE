import React from "react";
const GradePricingTable = ({ deviceCategory, tableData }) => {
  console.log("tabledata", tableData);
  return (
    <div className="m-2  w-[90%] md:m-5 overflow-x-auto">
      <div className="min-w-full">
        <table className="w-full border border-primary">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-2 text-sm md:p-3 md:text-base">Model Details</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Brand</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Updated At</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Storage</th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>A+</p>
                <p>(0.00%)</p>
              </th>
              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>A</p>
                <p>(10.00%)</p>
              </th>
              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>B</p>
                <p>(15.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>B-</p>
                <p>(20.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>C+</p>
                <p>(40.00%)</p>
              </th>
              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>C</p>
                <p>(50.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>C-</p>
                <p>(60.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>D+</p>
                <p>(65.00%)</p>
              </th>
              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>D</p>
                <p>(70.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>D-</p>
                <p>(70.00%)</p>
              </th>

              <th className="p-2 text-sm md:p-3 md:text-base">
                <p>E</p>
                <p>(90.00%)</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((listItem, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.model?.name}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.model.name.split(" ")[0]}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {new Date(listItem.updatedAt).toLocaleDateString("en-GB")}
                </td>

                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.storage}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.A_PLUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.A || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.B || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.B_MINUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.C_PLUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.C || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.C_MINUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.D_PLUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.D || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.D_MINUS || "-"}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {listItem.grades?.E || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradePricingTable;
