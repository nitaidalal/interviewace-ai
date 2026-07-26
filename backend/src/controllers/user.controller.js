import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import userService from '../services/user.service.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id)
  res.status(200).json(new ApiResponse(200, { user }, 'Profile fetched successfully'))
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body)
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'))
})

export const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await userService.uploadAvatar(req.user.id, req.file)
  res.status(200).json(new ApiResponse(200, { user }, 'Avatar uploaded successfully'))
})

export const removeAvatar = asyncHandler(async (req, res) => {
  const user = await userService.removeAvatar(req.user.id)
  res.status(200).json(new ApiResponse(200, { user }, 'Avatar removed successfully'))
})

export const getCredits = asyncHandler(async (req, res) => {
  const credits = await userService.getCredits(req.user.id)
  res.status(200).json(new ApiResponse(200, { credits }, 'Credits fetched successfully'))
})