package myapp.data;

public class ResponseData {

	public String message = "";
	public String status = "";
	public Object resultData = null;

	public ResponseData() {

	}

	public ResponseData(String status, String message, Object resultData) {
		this.status = status;
		this.message = message;
		this.resultData = resultData;
	}
}
