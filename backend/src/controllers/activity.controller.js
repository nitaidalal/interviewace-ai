import activityService from "../services/activity.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asynchandler from "../utils/asyncHandler.js";

export const getActivity = asynchandler(async (req, res) =>{
    const {page, limit, type} = req.query;
    const result = await activityService.getActivitiesByUser(req.user.id, {page, limit, type});
    res.status(200).json(new ApiResponse(200, result, "Activities fetched successfully"));
})