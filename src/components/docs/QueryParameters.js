import PropTypes from "prop-types";

/**
 * Component that displays the available query parameters for the API.
 * Shows a table of parameters with their descriptions, types, and examples.
 *
 * @param {Object} props - The component props
 * @param {Array<Object>} props.parameters - Array of parameter objects with details
 * @returns {JSX.Element} - The rendered query parameters documentation
 */
export function QueryParameters({ parameters }) {
  const isLastItem = (index) => index === parameters.length - 1;

  return (
    <div className="mb-8">
      <h3 className="mb-4">Query Parameters</h3>
      <p className="mb-4">The following parameters can be used to filter and paginate results:</p>

      <div className="rounded-lg border border-slate-200">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-th">Parameter</th>
              <th className="table-th">Type</th>
              <th className="table-th">Description</th>
              <th className="table-th">Default Value</th>
              <th className="table-th">Possible Values</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index} className="table-row-hover">
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.name}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.type}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.description}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>
                  {param.defaultValue && <code>{param.defaultValue}</code>}
                </td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.possibleValues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

QueryParameters.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      example: PropTypes.string.isRequired,
    })
  ).isRequired,
};
