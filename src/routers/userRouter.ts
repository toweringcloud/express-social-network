import express from "express";

import {
  readProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController";
import { fileUpload, protector } from "../middlewares";

const userRouter = express.Router();

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: 사용자 프로필 조회
 *    description: 특정 사용자의 프로필 정보를 조회합니다.
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: 조회할 사용자의 ID (username)
 *    responses:
 *      '200':
 *        description: 성공적으로 프로필 정보를 반환함.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *      '404':
 *        description: 사용자를 찾을 수 없음.
 */
userRouter.get("/:id", readProfile);

/**
 * @swagger
 * /users/change-pw:
 *  post:
 *    summary: 비밀번호 변경
 *    description: 로그인된 사용자의 비밀번호를 변경합니다.
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              currentPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *              newPassword2:
 *                type: string
 *    responses:
 *      '200':
 *        description: 비밀번호가 성공적으로 변경됨.
 *      '400':
 *        description: 현재 비밀번호가 일치하지 않음.
 *      '403':
 *        description: 인증되지 않은 사용자.
 */
userRouter.post("/change-pw", protector, changePassword);

/**
 * @swagger
 * /users/edit:
 *  put:
 *    summary: 사용자 프로필 수정
 *    description: "로그인된 사용자의 프로필 정보(예: 닉네임, 아바타 이미지)를 수정합니다."
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              avatar:
 *                type: string
 *                format: binary
 *              nickname:
 *                type: string
 *    responses:
 *      200:
 *        description: 프로필이 성공적으로 업데이트됨.
 *      403:
 *        description: 인증되지 않은 사용자.
 */
userRouter.put(
  "/edit",
  protector,
  fileUpload("avatars", 5).single("avatar"),
  updateProfile
);

export default userRouter;
