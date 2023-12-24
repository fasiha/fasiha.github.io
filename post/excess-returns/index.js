(async function main() {
  const res = await fetch("realExcessReturns.json");
  if (!res.ok) {
    throw new Error("network error", res.status);
  }
  const data = await res.json();
  let traces = data.map((horizon, hidx) => {
    let ret = horizon.returns;
    let x = ret.map((h) => h.ending);
    let y = ret.map((h) => h.xirr * 100);
    let median = horizon.median;
    return {
      x,
      y,
      name: `${horizon.years}y; median=${Math.round(median * 1e4) / 1e2}%`,
      line: { width: horizon.years < 10 ? 0.5 : 1 + hidx },
    };
  });
  let title = {
    text: `S&P500's real returns in excess of Treasuries: monthly dollar-cost averaging`,
  }; // investing $1 monthly, reinvesting dividends:
  let xaxis = { title: { text: "Horizon end date" } };
  let yaxis = { title: { text: "Annualized rate of return (%)" } };

  Plotly.newPlot("excess-all", traces, { title, xaxis, yaxis });

  // discrete and cumulative histograms
  function histogram(cumulative, divId) {
    Plotly.newPlot(
      divId,
      traces.map((t) => ({
        x: t.y,
        type: "histogram",
        histnorm: "probability",
        name: t.name,
        cumulative: { enabled: cumulative },
      })),
      cumulative
        ? {
            title: {
              text: `Cumulative histogram of S&P 500 real excess returns`,
            },
            xaxis: { title: `Annualized rate of return (%)` },
            yaxis: { title: `Fraction where returns < x axis` },
          }
        : {
            title: {
              text: `Histogram of S&P500 real excess returns: monthly dollar-cost averaging, 1871-`,
            },
            xaxis: { title: `Annualized rate of return (%)` },
            yaxis: { title: `Fraction` },
          }
    );
  }
  histogram(true, "histogram-cumulative");
  histogram(false, "histogram");
})();
