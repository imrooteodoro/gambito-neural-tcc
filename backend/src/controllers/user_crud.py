from src.services.insert_user import InsertUserService

class UserCRUDController:
    def __init__(self):
        self.insert_user_service = InsertUserService()

    def create_user(self, user_data):
        new_user = self.insert_user_service.insert_user(user_data)
        return new_user
    def get_user_by_username(self, user_name: str):
        user = self.insert_user_service.get_user_by_username(user_name)
        return user