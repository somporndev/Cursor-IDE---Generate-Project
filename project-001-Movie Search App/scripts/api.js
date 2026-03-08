const OMDB = {
  BASE: "https://www.omdbapi.com/",
  KEY: "a362467a",

  _url(params) {
    const qs = new URLSearchParams({ ...params, apikey: this.KEY });
    return `${this.BASE}?${qs}`;
  },

  async search(query) {
    const q = String(query).trim();
    if (!q) return { Search: [] };
    const res = await fetch(this._url({ s: q }));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getById(id) {
    if (!id) throw new Error("Missing imdbID");
    const res = await fetch(this._url({ i: id, plot: "full" }));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};
