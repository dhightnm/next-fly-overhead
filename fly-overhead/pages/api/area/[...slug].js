export async function handler(req, res) {
  // const latmin = req.params.latmin;
  //   const lonmin = req.params.lonmin;
  //   const latmax = req.params.latmax;
  //   const lonmax = req.params.lonmax;
  const { slug } = req.params; 
  console.log('LONMIN', slug)
  try {
    const areaRes = await axios.get(`https://${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}@opensky-network.org/api/states/all?lamin=${latmin}&lomin=${lonmin}&lamax=${latmax}&lomax=${lonmax}`);
    res.json(areaRes.data);
    }
    catch(err) {
        console.log(err);
    }
}