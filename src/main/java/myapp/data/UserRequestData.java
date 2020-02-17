package myapp.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class UserRequestData {
	public String userId = "";
	public String password = "";
	public String[] userIds = new String[] {};

	public UserRequestData() {

	}
}
