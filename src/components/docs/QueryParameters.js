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
        <table className="min-w-full overflow-hidden rounded-lg bg-white">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-b px-4 py-2 text-left whitespace-nowrap">Parameter</th>
              <th className="border-b px-4 py-2 text-left whitespace-nowrap">Type</th>
              <th className="border-b px-4 py-2 text-left whitespace-nowrap">Description</th>
              <th className="border-b px-4 py-2 text-left whitespace-nowrap">Default Value</th>
              <th className="border-b px-4 py-2 text-left whitespace-nowrap">Possible Values</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index}>
                <td className={`px-4 py-2 ${!isLastItem(index) ? "border-b" : ""}`}>{param.name}</td>
                <td className={`px-4 py-2 ${!isLastItem(index) ? "border-b" : ""}`}>{param.type}</td>
                <td className={`px-4 py-2 ${!isLastItem(index) ? "border-b" : ""}`}>{param.description}</td>
                <td className={`px-4 py-2 ${!isLastItem(index) ? "border-b" : ""}`}>
                  {param.defaultValue && <code>{param.defaultValue}</code>}
                </td>
                <td className={`px-4 py-2 ${!isLastItem(index) ? "border-b" : ""}`}>{param.possibleValues}</td>
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
