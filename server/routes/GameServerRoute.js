import express from "express";
import PermissionsManager from "../modules/PermissionsManager";
import Scopes from "../config/constants/Scopes";
import Permissions from "../config/constants/Permissions";
import PermissionController from "../controllers/PermissionController";
import GameServerController from "../controllers/GameServerController";

const router = express.Router();

/**
 * All these routes are prefixed by /api/user
 */

router.route('/minecraft')
    .get(PermissionsManager(Scopes.ANY, Permissions.MINECRAFT), GameServerController.getStateMinecraft);

router.route('/trackmania')
    .get(PermissionsManager(Scopes.ANY, Permissions.TRACKMANIA), GameServerController.getStateTrackmania);


export default router