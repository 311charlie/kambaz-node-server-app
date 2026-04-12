import UsersDao from "./dao.js";
export default function UserRoutes(app) {
  const dao = UsersDao();

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) { res.status(400).json({ message: "Username already taken" }); return; }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) { req.session["currentUser"] = currentUser; res.json(currentUser); }
    else { res.status(401).json({ message: "Unable to login. Try again later." }); }
  };
  const signout = (req, res) => { req.session.destroy(); res.sendStatus(200); };
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    res.json(currentUser);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) { res.json(await dao.findUsersByRole(role)); return; }
    if (name) { res.json(await dao.findUsersByPartialName(name)); return; }
    res.json(await dao.findAllUsers());
  };
  const findUserById = async (req, res) => res.json(await dao.findUserById(req.params.userId));
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    delete userUpdates._id;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      const updatedUser = await dao.findUserById(userId);
      req.session["currentUser"] = updatedUser;
    }
    const updatedUser = await dao.findUserById(userId);
    res.json(updatedUser);
  };
  const deleteUser = async (req, res) => res.json(await dao.deleteUser(req.params.userId));
  const createUser = async (req, res) => res.json(await dao.createUser(req.body));

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
