package myapp.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.naming.InitialContext;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;

import myapp.data.ResponseData;
import myapp.data.UserData;
import myapp.data.UserRequestData;

@Path("/User")
public class UsersController {

	@Path("List")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseData getUser(@Context HttpServletRequest request) {
		ResponseData res = new ResponseData();
		String status = "";
		String message = "";
		try {

			// 1. DataSourceを取得
			javax.naming.Context initContext = new InitialContext();
			javax.naming.Context envContext  = (javax.naming.Context)initContext.lookup("java:/comp/env");
			DataSource ds = (DataSource)envContext.lookup("jdbc/myapp");

			// 2. QueryRunnerオブジェクトを生成
			QueryRunner runner = new QueryRunner(ds);

			// 3. ResultSetHandlerを実装したクラスのオブジェクトを生成
			ResultSetHandler<List<UserData>> rs = new BeanListHandler<UserData>(UserData.class);

			// 4. queryメソッドを実行
			List<UserData> users = runner.query("select user_id as userId,password,sys_date from tbl_users ORDER BY sys_date", rs);
			res.resultData = users;

			status = "success";
			message = "取得に成功しました。";

		} catch (Exception e) {
			e.printStackTrace();
			status = "error";
			message = "失敗しました。";
		}

		res.status = status;
		res.message = message;

		return res;
	}

	@Path("Add")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseData insert(@Context HttpServletRequest request, UserRequestData requestData) {
		ResponseData res = new ResponseData();
		String status = "";
		String message = "";
		try {

			// 1. DataSourceを取得
			javax.naming.Context initContext = new InitialContext();
			javax.naming.Context envContext  = (javax.naming.Context)initContext.lookup("java:/comp/env");
			DataSource ds = (DataSource)envContext.lookup("jdbc/myapp");

			// 2. QueryRunnerオブジェクトを生成
			QueryRunner runner = new QueryRunner(ds);

			int rows = runner.update("insert tbl_users (user_id, password) values(?, ?)", requestData.userId, requestData.password);
			res.resultData = rows;

			status = "success";
			message = "追加に成功しました。";

		} catch (Exception e) {
			e.printStackTrace();
			status = "error";
			message = "失敗しました。";
		}

		res.status = status;
		res.message = message;

		return res;
	}

	@Path("Update")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseData update(@Context HttpServletRequest request, UserRequestData requestData) {
		ResponseData res = new ResponseData();
		String status = "";
		String message = "";
		try {

			// 1. DataSourceを取得
			javax.naming.Context initContext = new InitialContext();
			javax.naming.Context envContext  = (javax.naming.Context)initContext.lookup("java:/comp/env");
			DataSource ds = (DataSource)envContext.lookup("jdbc/myapp");

			// 2. QueryRunnerオブジェクトを生成
			QueryRunner runner = new QueryRunner(ds);

			int rows = runner.update("update tbl_users set password = ?,sys_date=now() where user_id = ?", requestData.password, requestData.userId);
			res.resultData = rows;

			status = "success";
			message = "更新に成功しました。";

		} catch (Exception e) {
			e.printStackTrace();
			status = "error";
			message = "失敗しました。";
		}

		res.status = status;
		res.message = message;

		return res;
	}

	@Path("Delete")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseData delete(@Context HttpServletRequest request, UserRequestData requestData) {
		ResponseData res = new ResponseData();
		String status = "";
		String message = "";
		try {

			// 1. DataSourceを取得
			javax.naming.Context initContext = new InitialContext();
			javax.naming.Context envContext  = (javax.naming.Context)initContext.lookup("java:/comp/env");
			DataSource ds = (DataSource)envContext.lookup("jdbc/myapp");

			// 2. QueryRunnerオブジェクトを生成
			QueryRunner runner = new QueryRunner(ds);

			//int rows = runner.update("delete from tbl_users where user_id in (?)", requestData.userIds);
			//int rows = runner.update("delete from tbl_users where user_id = ?", requestData.userId);

		    List<Object[]> params = new ArrayList<Object[]>();
		    for (String userId : requestData.userIds) {
			    params.add(new Object[]{ userId });
			}

			int[] rows = runner.batch("delete from tbl_users where user_id = ?", params.toArray(new Object[0][]));

			res.resultData = rows;

			status = "success";
			message = "削除に成功しました。";

		} catch (Exception e) {
			e.printStackTrace();
			status = "error";
			message = "失敗しました。";
		}

		res.status = status;
		res.message = message;

		return res;
	}

}
