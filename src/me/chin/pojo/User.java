package me.chin.pojo;

public class User {
	private Integer uid;
	private String uname;
	private String pword;
	private String email;
	
	public User(Integer uid){
		this.uid=uid;
		System.out.println("User constructed");
	}
	
	public Integer getUid() {
		return uid;
	}
	public void setUid(Integer uid) {
		this.uid = uid;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getPword() {
		return pword;
	}
	public void setPword(String pword) {
		this.pword = pword;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String toString() {
		return "[object "+this.getClass().getSimpleName()+"]";
	}
}
