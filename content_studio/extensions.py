import uuid


class BaseExtension:
    extension_type: str
    extension_id: uuid.UUID

    def __init__(self):
        self.extension_id = uuid.uuid4()

    def serialize(self):
        return {
            "extension_type": self.extension_type,
            "extension_id": str(self.extension_id),
        }


class MainMenuLink(BaseExtension):
    extension_type = "MainMenuLink"
    url: str
    label: str
    icon: str = None
    color: str = None
    weight: int = 0

    def __init__(
        self, url: str, label: str, icon: str = None, color: str = None, weight: int = 0
    ):
        self.url = url
        self.label = label
        self.icon = icon
        self.color = color
        self.weight = weight
        super().__init__()

    def serialize(self):
        return {
            **super().serialize(),
            "config": {
                "url": self.url,
                "icon": self.icon,
                "color": self.color,
                "label": self.label,
            },
        }


class IFramePage(BaseExtension):
    extension_type = "IFramePage"
    path: str
    iframe_url: str

    def __init__(
        self,
        path: str,
        iframe_url: str,
    ):
        self.path = path
        self.iframe_url = iframe_url
        super().__init__()

    def serialize(self):
        return {
            **super().serialize(),
            "config": {
                "path": self.path,
                "iframe_url": self.iframe_url,
            },
        }
