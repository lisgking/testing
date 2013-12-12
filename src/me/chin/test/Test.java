package me.chin.test;

import me.chin.pojo.CoreInternalUser;
import me.chin.pojo.User;


public class Test {
	public static void main(String[] args) {
		User u=new CoreInternalUser(100);
		System.out.println(u);
		System.out.println(u.getClass().getSuperclass().getName());
	}
}
